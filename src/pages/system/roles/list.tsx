import type { ColumnsType } from 'antd/es/table'
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from '@refinedev/antd'
import { Space, Table, Tag } from 'antd'
import { useState } from 'react'
import { PermissionManageButton } from '@/components/PermissionManageButton'
import { RolePermissionManager } from '@/components/RolePermissionManager'

interface IRole {
  id: string
  name: string
  description?: string
  status: number
  createdAt: string
  updatedAt: string
}

export function RoleList() {
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)

  const { tableProps } = useTable<IRole>({
    syncWithLocation: true,
  })

  const handleManagePermissions = (roleId: string) => {
    setSelectedRoleId(roleId)
    setPermissionModalVisible(true)
  }

  const columns: ColumnsType<IRole> = [
    {
      title: '角色标识',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => description || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: number) => {
        const statusConfig = {
          1: { color: 'green', text: '启用' },
          0: { color: 'orange', text: '禁用' },
        }
        const config = statusConfig[status as unknown as keyof typeof statusConfig] || {
          color: 'default',
          text: '未知',
        }
        return <Tag color={config.color}>{config.text}</Tag>
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <ShowButton
            hideText
            size="small"
            recordItemId={record.id}
            resource="roles"
          />
          <EditButton
            hideText
            size="small"
            recordItemId={record.id}
            resource="roles"
          />
          <PermissionManageButton
            roleId={record.id}
            onManagePermissions={handleManagePermissions}
          />
          <DeleteButton
            hideText
            size="small"
            recordItemId={record.id}
            resource="roles"
          />
        </Space>
      ),
    },
  ]

  const selectedRole = tableProps.dataSource?.find(role => role.id === selectedRoleId)

  return (
    <>
      <List
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
          </>
        )}
      >
        <Table {...tableProps} columns={columns} rowKey="id" />
      </List>

      {/* 权限管理弹窗 */}
      {permissionModalVisible && selectedRoleId && (
        <RolePermissionManager
          visible={permissionModalVisible}
          onClose={() => {
            setPermissionModalVisible(false)
            setSelectedRoleId(null)
          }}
          roleId={selectedRoleId}
          roleName={selectedRole?.name}
        />
      )}
    </>
  )
}
