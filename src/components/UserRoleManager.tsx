/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
/* eslint-disable react/no-unstable-default-props */
/* eslint-disable unused-imports/no-unused-vars */
import { useCan, useCustomMutation, useInvalidate, useList } from '@refinedev/core'
import { Button, Divider, message, Modal, Select, Space, Tag } from 'antd'
import { useEffect, useState } from 'react'

interface Role {
  id: string
  name: string
}

interface UserRoleManagerProps {
  visible: boolean
  onClose: () => void
  userId: string
  currentRoles?: Role[]
}

export function UserRoleManager({
  visible,
  onClose,
  userId,
  currentRoles = [],
}: UserRoleManagerProps) {
  // @ts-expect-error 1111
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [rolesToAdd, setRolesToAdd] = useState<string[]>([])
  const [rolesToRemove, setRolesToRemove] = useState<string[]>([])

  const invalidate = useInvalidate()

  // 获取角色列表
  const { data: rolesData, isLoading: isLoadingRoles } = useList<Role>({
    resource: 'roles',
    pagination: { mode: 'off' }, // 获取所有角色，不分页
  })

  const availableRoles = rolesData?.data || []

  // 权限检查
  const { data: canUpdateRoles } = useCan({
    resource: 'users',
    action: 'updateRoles',
    params: { id: userId },
  })

  // 添加角色的 mutation
  const { mutate: addRolesMutate, isPending: isAddingRoles } = useCustomMutation()

  // 删除角色的 mutation
  const { mutate: removeRolesMutate, isPending: isRemovingRoles } = useCustomMutation()

  // 当前用户拥有的角色ID
  const currentRoleIds = currentRoles.map(role => role.id)

  // 可以添加的角色（不包括已有的角色）
  const availableToAdd = availableRoles.filter(
    role => !currentRoleIds.includes(role.id),
  )

  // 重置状态
  useEffect(() => {
    if (visible) {
      setRolesToAdd([])
      setRolesToRemove([])
      setSelectedRoles([])
    }
  }, [visible])

  const handleAddRoles = () => {
    if (rolesToAdd.length === 0) {
      message.warning('请选择要添加的角色')
      return
    }

    // 合并现有角色和新角色
    const allRoleIds = [...currentRoleIds, ...rolesToAdd]

    addRolesMutate(
      {
        url: `/api/admin/system/users/${userId}/roles`,
        method: 'put',
        values: {
          roleIds: allRoleIds,
        },
      },
      {
        onSuccess: () => {
          message.success('角色添加成功')
          invalidate({
            resource: 'users',
            invalidates: ['list', 'detail'],
          })
          setRolesToAdd([])
        },
        onError: (error: any) => {
          message.error(`角色添加失败: ${error?.message || '未知错误'}`)
        },
      },
    )
  }

  const handleRemoveRoles = () => {
    if (rolesToRemove.length === 0) {
      message.warning('请选择要删除的角色')
      return
    }

    // 从现有角色中移除选中的角色
    const remainingRoleIds = currentRoleIds.filter(id => !rolesToRemove.includes(id))

    removeRolesMutate(
      {
        url: `/api/admin/system/users/${userId}/roles`,
        method: 'put',
        values: {
          roleIds: remainingRoleIds,
        },
      },
      {
        onSuccess: () => {
          message.success('角色删除成功')
          invalidate({
            resource: 'users',
            invalidates: ['list', 'detail'],
          })
          setRolesToRemove([])
        },
        onError: (error: any) => {
          message.error(`角色删除失败: ${error?.message || '未知错误'}`)
        },
      },
    )
  }

  const isPending = isAddingRoles || isRemovingRoles

  return (
    <Modal
      title="角色管理"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div style={{ padding: '16px 0' }}>
        {/* 当前角色 */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ marginBottom: 12 }}>当前角色：</h4>
          {currentRoles.length > 0
            ? (
                <Space size={[0, 8]} wrap>
                  {currentRoles.map(role => (
                    <Tag
                      key={role.id}
                      color="blue"
                      closable={canUpdateRoles?.can && !isPending}
                      onClose={() => {
                        if (rolesToRemove.includes(role.id)) {
                          setRolesToRemove(prev => prev.filter(id => id !== role.id))
                        }
                        else {
                          setRolesToRemove(prev => [...prev, role.id])
                        }
                      }}
                      style={{
                        backgroundColor: rolesToRemove.includes(role.id)
                          ? '#ff4d4f'
                          : undefined,
                        borderColor: rolesToRemove.includes(role.id)
                          ? '#ff4d4f'
                          : undefined,
                      }}
                    >
                      {role.name}
                      {rolesToRemove.includes(role.id) && ' (待删除)'}
                    </Tag>
                  ))}
                </Space>
              )
            : (
                <Tag color="default">暂无角色</Tag>
              )}
        </div>

        <Divider />

        {/* 添加角色 */}
        {canUpdateRoles?.can && (
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 12 }}>添加角色：</h4>
            {isLoadingRoles
              ? (
                  <Select
                    mode="multiple"
                    style={{ width: '100%', marginBottom: 12 }}
                    placeholder="加载角色列表中..."
                    loading={true}
                    disabled={true}
                  />
                )
              : availableToAdd.length > 0
                ? (
                    <Select
                      mode="multiple"
                      style={{ width: '100%', marginBottom: 12 }}
                      placeholder="选择要添加的角色"
                      value={rolesToAdd}
                      onChange={setRolesToAdd}
                      disabled={isPending}
                      options={availableToAdd.map(role => ({
                        label: role.name,
                        value: role.id,
                      }))}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    />
                  )
                : (
                    <div style={{ color: '#999', padding: '8px 0' }}>
                      暂无可添加的角色
                    </div>
                  )}
          </div>
        )}

        {/* 操作按钮 */}
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>
            取消
          </Button>

          {canUpdateRoles?.can && rolesToRemove.length > 0 && (
            <Button
              danger
              loading={isRemovingRoles}
              onClick={handleRemoveRoles}
            >
              删除角色 (
              {rolesToRemove.length}
              )
            </Button>
          )}

          {canUpdateRoles?.can && rolesToAdd.length > 0 && (
            <Button
              type="primary"
              loading={isAddingRoles}
              onClick={handleAddRoles}
            >
              添加角色 (
              {rolesToAdd.length}
              )
            </Button>
          )}
        </Space>

        {/* 权限提示 */}
        {!canUpdateRoles?.can && (
          <div style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: '#f5f5f5',
            borderRadius: 4,
            textAlign: 'center',
            color: '#666',
          }}
          >
            您没有管理此用户角色的权限
          </div>
        )}
      </div>
    </Modal>
  )
}
