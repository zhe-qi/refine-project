import type { TreeDataNode, TreeProps } from 'antd'
import type { PermissionItem } from '@/config/resources'
import { useCan, useCustomMutation, useInvalidate } from '@refinedev/core'
import { Button, Divider, message, Modal, Space, Tree } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { systemRolesIdPermissionsUsingGet } from '@/api/admin/rolesxitongjiaose'
import { getAllPermissions } from '@/config/resources'

interface RolePermissionManagerProps {
  visible: boolean
  onClose: () => void
  roleId: string
  roleName?: string
}

interface PermissionTreeNode extends TreeDataNode {
  key: string
  title: string
  checkable?: boolean
  children?: PermissionTreeNode[]
  // 叶子节点的权限信息
  resource?: string
  method?: string
  isParent?: boolean
}

export function RolePermissionManager({
  visible,
  onClose,
  roleId,
  roleName = '角色',
}: RolePermissionManagerProps) {
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<string[]>([])
  const [currentPermissions, setCurrentPermissions] = useState<string[][]>([])
  const [loading, setLoading] = useState(false)
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])

  const invalidate = useInvalidate()

  // 计算树状态（选中、半选中、展开）
  const calculateTreeState = useCallback((treeData: PermissionTreeNode[], selectedLeafKeys: string[]) => {
    const checked = new Set<string>()
    const halfChecked = new Set<string>()
    const expanded = new Set<string>()

    // 添加叶子节点
    selectedLeafKeys.forEach((key: string) => {
      checked.add(key)
    })

    // 递归计算父节点状态
    const calculateNodeState = (node: PermissionTreeNode): 'none' | 'partial' | 'all' => {
      if (!node.children || node.children.length === 0) {
        // 叶子节点
        return checked.has(node.key) ? 'all' : 'none'
      }

      // 父节点 - 计算子节点状态
      let allSelected = true
      let noneSelected = true

      node.children.forEach((child: PermissionTreeNode) => {
        const childState = calculateNodeState(child)

        if (childState === 'all') {
          noneSelected = false
        }
        else if (childState === 'partial') {
          allSelected = false
          noneSelected = false
        }
        else {
          allSelected = false
        }
      })

      if (allSelected) {
        checked.add(node.key)
        if (node.children.some(c => c.children && c.children.length > 0)) {
          expanded.add(node.key) // 展开有子节点的节点
        }
        return 'all'
      }
      else if (!noneSelected) {
        halfChecked.add(node.key)
        expanded.add(node.key) // 展开半选中的节点
        return 'partial'
      }
      else {
        return 'none'
      }
    }

    treeData.forEach(node => calculateNodeState(node))

    return {
      checked: Array.from(checked),
      halfChecked: Array.from(halfChecked),
      expanded: Array.from(expanded),
    }
  }, [])

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


  // 生成权限树结构（目录->菜单->操作的三级结构）
  const permissionTree = useMemo((): PermissionTreeNode[] => {
    const allPermissions = getAllPermissions()

    // 构建三级树结构：父目录 -> 菜单 -> 操作
    const tree: PermissionTreeNode[] = []
    const directoryMap = new Map<string, Map<string, PermissionItem[]>>()

    // 按父目录和菜单分组权限
    allPermissions.forEach((permission) => {
      // 如果有父目录，使用父目录；否则直接使用菜单名称作为顶级
      const parentDirectory = permission.parentCategory || permission.category
      const menuName = permission.parentCategory ? permission.category : null

      if (!directoryMap.has(parentDirectory)) {
        directoryMap.set(parentDirectory, new Map())
      }

      const menuMap = directoryMap.get(parentDirectory)!
      const menuKey = menuName || 'direct' // 直接挂在目录下的权限

      if (!menuMap.has(menuKey)) {
        menuMap.set(menuKey, [])
      }

      menuMap.get(menuKey)!.push(permission)
    })

    // 构建树结构
    directoryMap.forEach((menuMap, directoryName) => {
      // 创建目录节点（一级）
      const directoryNode: PermissionTreeNode = {
        key: `directory-${directoryName}`,
        title: directoryName,
        checkable: true,
        isParent: true,
        children: [],
      }

      menuMap.forEach((permissions, menuKey) => {
        if (menuKey === 'direct') {
          // 权限直接挂在目录下，不需要二级菜单
          permissions.forEach((permission) => {
            const actionNode: PermissionTreeNode = {
              key: permission.key,
              title: permission.title,
              checkable: true,
              resource: permission.resource,
              method: permission.method,
              isParent: false,
            }

            directoryNode.children!.push(actionNode)
          })
        }
        else {
          // 创建菜单节点（二级）
          const menuNode: PermissionTreeNode = {
            key: `menu-${permissions[0].categoryKey}`,
            title: menuKey,
            checkable: true,
            isParent: true,
            children: [],
          }

          // 创建操作节点（三级）
          permissions.forEach((permission) => {
            const actionNode: PermissionTreeNode = {
              key: permission.key,
              title: permission.title,
              checkable: true,
              resource: permission.resource,
              method: permission.method,
              isParent: false,
            }

            menuNode.children!.push(actionNode)
          })

          directoryNode.children!.push(menuNode)
        }
      })

      tree.push(directoryNode)
    })

    return tree
  }, [])

  // 获取角色当前权限
  const fetchRolePermissions = useCallback(async () => {
    if (!roleId)
      return

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
        const selectedKeys = response.data.map((permission) => {
          const [, resource, method] = permission
          return `${resource}:${method}`
        })

        // 计算哪些父节点应该被选中或半选中
        if (permissionTree && permissionTree.length > 0) {
          const { checked, halfChecked, expanded } = calculateTreeState(permissionTree, selectedKeys)

          setCheckedKeys(checked)
          setHalfCheckedKeys(halfChecked)
          setExpandedKeys(expanded)
        }
        else {
          // 如果树还没有构建完成，只设置叶子节点
          setCheckedKeys(selectedKeys)
          setHalfCheckedKeys([])
          setExpandedKeys([])
        }
      }
    }
    catch (error) {
      message.error('获取角色权限失败')
      console.error('获取角色权限失败:', error)
    }
    finally {
      setLoading(false)
    }
  }, [roleId, calculateTreeState, permissionTree])

  // 当 permissionTree 构建完成后重新计算树状态
  useEffect(() => {
    if (permissionTree && permissionTree.length > 0 && currentPermissions.length > 0) {
      // 转换当前权限为选中的键
      const selectedKeys = currentPermissions.map((permission) => {
        const [, resource, method] = permission
        return `${resource}:${method}`
      })

      const { checked, halfChecked, expanded } = calculateTreeState(permissionTree, selectedKeys)
      setCheckedKeys(checked)
      setHalfCheckedKeys(halfChecked)
      setExpandedKeys(expanded)
    }
  }, [permissionTree, currentPermissions, calculateTreeState])

  // 重置状态
  useEffect(() => {
    if (visible && roleId) {
      fetchRolePermissions()
    }
    else if (!visible) {
      setCheckedKeys([])
      setHalfCheckedKeys([])
      setCurrentPermissions([])
      setExpandedKeys([])
    }
  }, [visible, roleId, fetchRolePermissions])

  // 树选择变化处理 - 支持父子级联动
  const onCheck: TreeProps['onCheck'] = (checkedInfo) => {
    const { checked, halfChecked } = checkedInfo as { checked: string[], halfChecked: string[] }

    // 使用 Ant Design 内置的父子级联动逻辑
    setCheckedKeys(checked)
    setHalfCheckedKeys(halfChecked)
  }

  // 树展开变化
  const onExpand = (keys: React.Key[]) => {
    setExpandedKeys(keys.map(key => String(key)))
  }

  // 获取所有叶子节点的键（用于全选/全不选）
  const getAllLeafKeys = () => {
    const keys: string[] = []
    const traverse = (nodes: PermissionTreeNode[]) => {
      (nodes || []).forEach((node) => {
        if (!node.children || node.children.length === 0) {
          if (node.checkable && !node.isParent) {
            keys.push(node.key)
          }
        }
        else {
          traverse(node.children)
        }
      })
    }
    traverse(permissionTree || [])
    return keys
  }

  // 全选
  const handleSelectAll = () => {
    const allKeys = getAllLeafKeys()
    const { checked, halfChecked, expanded } = calculateTreeState(permissionTree, allKeys)
    setCheckedKeys(checked)
    setHalfCheckedKeys(halfChecked)
    setExpandedKeys(expanded)
  }

  // 全不选
  const handleDeselectAll = () => {
    setCheckedKeys([])
    setHalfCheckedKeys([])
  }

  // 保存权限
  const handleSave = () => {
    if (!hasAllPermissions) {
      message.error('您没有权限管理角色权限')
      return
    }

    // 只保存叶子节点的权限
    const leafPermissions: string[][] = []

    checkedKeys.forEach((key: string) => {
      if (key.includes(':')) { // 只有叶子节点包含 ':'
        const [resource, method] = key.split(':')
        // 构造完整的 6 元组格式，subject 用角色ID，其余为空字符串
        leafPermissions.push([roleId, resource, method, '', '', ''])
      }
    })

    updatePermissions(
      {
        url: `/api/admin/system/roles/${roleId}/permissions`,
        method: 'post',
        values: {
          permissions: leafPermissions,
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
      width={800}
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
              已选择: {checkedKeys.filter(key => key.includes(':')).length} 项权限
            </span>
          </Space>
        </div>

        <Divider />

        {/* 权限树 */}
        <div style={{ maxHeight: 450, overflowY: 'auto' }}>
          {loading
            ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  加载权限列表...
                </div>
              )
            : (
                <Tree
                  checkable
                  checkStrictly={false} // 启用父子级联动
                  checkedKeys={{
                    checked: checkedKeys || [],
                    halfChecked: halfCheckedKeys || [],
                  }}
                  expandedKeys={expandedKeys || []}
                  onCheck={onCheck}
                  onExpand={onExpand}
                  treeData={permissionTree}
                  disabled={isPending}
                  height={400}
                  showLine={true} // 显示连接线
                  defaultExpandAll={false}
                />
              )
          }
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
