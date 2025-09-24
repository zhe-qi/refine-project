import type { CrudFilters, LogicalFilter } from '@refinedev/core'
import type { ColumnsType } from 'antd/es/table'
import { UserOutlined } from '@ant-design/icons'
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from '@refinedev/antd'
import { Avatar, Col, Form, Input, Select, Space, Table, Tag } from 'antd'
import { useState } from 'react'
import { RoleManageButton } from '@/components/RoleManageButton'
import SearchForm from '@/components/SearchForm'
import { UserRoleManager } from '@/components/UserRoleManager'

interface IUser {
  id: string
  username: string
  nickName: string
  avatar?: string
  status: number
  createdAt: string
  updatedAt: string
  roles?: Array<{
    id: string
    name: string
  }>
}

export function UserList() {
  const [roleModalVisible, setRoleModalVisible] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const { tableProps, searchFormProps } = useTable<IUser>({
    syncWithLocation: true,
    onSearch: (values: any): CrudFilters => {
      const filters: LogicalFilter[] = [
        {
          field: 'username',
          operator: 'contains' as const,
          value: values?.username,
        },
        {
          field: 'nickName',
          operator: 'contains' as const,
          value: values?.nickName,
        },
        {
          field: 'status',
          operator: 'eq' as const,
          value: values?.status,
        },
      ].filter(item => item.value !== undefined && item.value !== null && item.value !== '') as LogicalFilter[]

      return filters
    },
  })

  const handleManageRoles = (userId: string) => {
    setSelectedUserId(userId)
    setRoleModalVisible(true)
  }

  const columns: ColumnsType<IUser> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string) => (
        <Avatar
          size={40}
          src={avatar}
          icon={<UserOutlined />}
        />
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: Array<{ id: string, name: string }> | null) => {
        if (!roles || roles.length === 0) {
          return <Tag color="default">无角色</Tag>
        }
        return (
          <Space size={[0, 8]} wrap>
            {roles.map(role => (
              <Tag key={role.id} color="blue">
                {role.name}
              </Tag>
            ))}
          </Space>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        const statusConfig = {
          '1': { color: 'green', text: '启用' },
          '0': { color: 'orange', text: '禁用' },
          '-1': { color: 'red', text: '封禁' },
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
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <ShowButton
            hideText
            size="small"
            recordItemId={record.id}
            resource="user"
            accessControl={{
              enabled: true,
              hideIfUnauthorized: false,
            }}
          />
          <EditButton
            hideText
            size="small"
            recordItemId={record.id}
            resource="user"
            accessControl={{
              enabled: true,
              hideIfUnauthorized: false,
            }}
          />
          <RoleManageButton
            userId={record.id}
            onManageRoles={handleManageRoles}
          />
          <DeleteButton
            hideText
            size="small"
            recordItemId={record.id}
            resource="user"
            accessControl={{
              enabled: true,
              hideIfUnauthorized: false,
            }}
          />
        </Space>
      ),
    },
  ]

  const selectedUser = tableProps.dataSource?.find(user => user.id === selectedUserId)

  return (
    <>
      <List
        headerButtons={({ defaultButtons }) => (
          <>
            {defaultButtons}
          </>
        )}
      >
        <SearchForm form={searchFormProps.form} onFinish={searchFormProps.onFinish}>
          <Col span={6}>
            <Form.Item name="username" label="用户名">
              <Input placeholder="请输入用户名" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="nickName" label="昵称">
              <Input placeholder="请输入昵称" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="status" label="状态">
              <Select placeholder="请选择状态" allowClear>
                <Select.Option value="1">启用</Select.Option>
                <Select.Option value="0">禁用</Select.Option>
                <Select.Option value="-1">封禁</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </SearchForm>
        <Table
          {...(tableProps as any)}
          columns={columns}
          rowKey="id"
          dataSource={tableProps.dataSource as IUser[]}
        />
      </List>

      {/* 角色管理弹窗 */}
      {roleModalVisible && selectedUserId && (
        <UserRoleManager
          visible={roleModalVisible}
          onClose={() => {
            setRoleModalVisible(false)
            setSelectedUserId(null)
          }}
          userId={selectedUserId}
          currentRoles={selectedUser?.roles || []}
        />
      )}
    </>
  )
}
