import { useCan, useCustomMutation, useInvalidate } from '@refinedev/core'
import { Button, message, Modal, Tree, Space, Divider } from 'antd'
import type { TreeProps } from 'antd'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { getAllPermissions, type PermissionItem } from '@/config/resources'
import { systemRolesIdPermissionsUsingGet, systemRolesIdPermissionsUsingPost } from '@/api/admin/rolesxitongjiaose'

interface RolePermissionManagerProps {
  visible: boolean
  onClose: () => void
  roleId: string
  roleName?: string
}

interface PermissionTreeNode {
  key: string
  title: string
  checkable: boolean
  children?: PermissionTreeNode[]
  // 叶子节点的权限信息
  resource?: string
  method?: string
}

export function RolePermissionManager({
  visible,
  onClose,
  roleId,
  roleName = '角色',
}: RolePermissionManagerProps) {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [currentPermissions, setCurrentPermissions] = useState<string[][]>([])
  const [loading, setLoading] = useState(false)

  const invalidate = useInvalidate()

  // 权限检查：需要三个权限才能管理角色权限
  // 1. GET /system/roles/{id}/permissions - 获取角色权限
  const { data: canGetPermissions } = useCan({
    resource: 'roles',
    action: 'show',
    params: { id: roleId },
  })

  // 2. POST /system/roles/{id}/permissions - 分配权限
  const { data: canAddPermissions } = useCan({
    resource: 'roles', 
    action: 'edit',
    params: { id: roleId },
  })

  // 3. DELETE /system/roles/{id}/permissions - 删除权限  
  const { data: canDeletePermissions } = useCan({
    resource: 'roles',
    action: 'delete', 
    params: { id: roleId },
  })

  // 只有拥有所有三个权限才能管理权限
  const hasAllPermissions = canGetPermissions?.can && canAddPermissions?.can && canDeletePermissions?.can

  // 权限更新 mutation
  const { mutate: updatePermissions, isPending: isUpdating } = useCustomMutation()

  // 生成权限树结构
  const permissionTree = useMemo((): PermissionTreeNode[] => {
    const allPermissions = getAllPermissions()
    const categoryMap = new Map<string, PermissionItem[]>()

    // 按分类分组权限
    allPermissions.forEach((permission) => {
      const category = permission.category
      if (!categoryMap.has(category)) {
        categoryMap.set(category, [])
      }
      categoryMap.get(category)!.push(permission)
    })

    // 构建树结构
    const tree: PermissionTreeNode[] = []
    categoryMap.forEach((permissions, category) => {
      const categoryKey = permissions[0].categoryKey
      const categoryNode: PermissionTreeNode = {
        key: categoryKey,
        title: category,
        checkable: false, // 分类节点不可直接选择
        children: permissions.map(permission => ({
          key: permission.key,
          title: permission.title,
          checkable: true,
          resource: permission.resource,
          method: permission.method,
        })),
      }
      tree.push(categoryNode)
    })

    return tree
  }, [])

  // 获取角色当前权限
  const fetchRolePermissions = useCallback(async () => {
    if (!roleId) return

    setLoading(true)
    try {
      const response = await systemRolesIdPermissionsUsingGet({
        params: { id: roleId },
      })
      
      if (response.data) {
        setCurrentPermissions(response.data)
        
        // 转换为选中的键
        // 后端返回格式: [subject, resource, method, ...]
        // 我们需要的格式: resource:method
        const selectedKeys = response.data.map(permission => {
          const [subject, resource, method] = permission
          return `${resource}:${method}`
        })
        setCheckedKeys(selectedKeys)
      }
    } catch (error) {
      message.error('获取角色权限失败')
      console.error('获取角色权限失败:', error)
    } finally {
      setLoading(false)
    }
  }, [roleId])

  // 重置状态
  useEffect(() => {
    if (visible && roleId) {
      fetchRolePermissions()
    } else if (!visible) {
      setCheckedKeys([])
      setCurrentPermissions([])
    }
    // 只依赖 visible 和 roleId 的变化
  }, [visible, roleId])

  // 树选择变化
  const onCheck: TreeProps['onCheck'] = (checked) => {
    const keys = Array.isArray(checked) ? checked : checked.checked
    setCheckedKeys(keys as string[])
  }

  // 获取所有叶子节点的键（用于全选/全不选）
  const getAllLeafKeys = () => {
    const keys: string[] = []
    const traverse = (nodes: PermissionTreeNode[]) => {
      nodes.forEach(node => {
        if (node.children) {
          traverse(node.children)
        } else if (node.checkable) {
          keys.push(node.key)
        }
      })
    }
    traverse(permissionTree)
    return keys
  }

  // 全选
  const handleSelectAll = () => {
    setCheckedKeys(getAllLeafKeys())
  }

  // 全不选
  const handleDeselectAll = () => {
    setCheckedKeys([])
  }

  // 保存权限
  const handleSave = () => {
    if (!hasAllPermissions) {
      message.error('您没有权限管理角色权限')
      return
    }

    // 将选中的键转换为权限数组
    // 后端期望格式: [subject, resource, method, "", "", ""]
    const permissions: string[][] = []
    
    checkedKeys.forEach(key => {
      if (key.includes(':')) {
        const [resource, method] = key.split(':')
        // 构造完整的 6 元组格式，subject 用角色ID，其余为空字符串
        permissions.push([roleId, resource, method, '', '', ''])
      }
    })

    updatePermissions(
      {
        url: `/api/admin/system/roles/${roleId}/permissions`,
        method: 'post',
        values: {
          permissions,
        },
      },
      {
        onSuccess: () => {
          message.success('权限分配成功')
          invalidate({
            resource: 'roles',
            invalidates: ['list', 'detail'],
          })
          onClose()
        },
        onError: (error: any) => {
          message.error(`权限分配失败: ${error?.message || '未知错误'}`)
        },
      },
    )
  }

  const isPending = loading || isUpdating

  return (
    <Modal
      title={`分配权限 - ${roleName}`}
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={isUpdating}
          onClick={handleSave}
          disabled={!hasAllPermissions}
        >
          保存
        </Button>,
      ]}
    >
      <div style={{ padding: '16px 0' }}>
        {/* 工具栏 */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button size="small" onClick={handleSelectAll} disabled={isPending}>
              全选
            </Button>
            <Button size="small" onClick={handleDeselectAll} disabled={isPending}>
              全不选
            </Button>
            <span style={{ color: '#666', marginLeft: 16 }}>
              已选择: {checkedKeys.length} 项权限
            </span>
          </Space>
        </div>

        <Divider />

        {/* 权限树 */}
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              加载权限列表...
            </div>
          ) : (
            <Tree
              checkable
              checkedKeys={checkedKeys}
              onCheck={onCheck}
              treeData={permissionTree}
              disabled={isPending}
              height={350}
            />
          )}
        </div>

        {/* 权限提示 */}
        {!hasAllPermissions && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: '#f5f5f5',
              borderRadius: 4,
              textAlign: 'center',
              color: '#666',
            }}
          >
            您没有管理此角色权限的权限
          </div>
        )}
      </div>
    </Modal>
  )
}