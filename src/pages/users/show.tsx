import { UserOutlined } from '@ant-design/icons'
import { DateField, Show, TextField } from '@refinedev/antd'
import { useShow } from '@refinedev/core'
import { Avatar, Card, Descriptions, Tag, Typography } from 'antd'

const { Title } = Typography

interface IUser {
  id: string
  username: string
  nickName: string
  avatar?: string
  status: number
  createdAt: string
  updatedAt: string
  builtIn?: boolean
}

export function UserShow() {
  const { queryResult } = useShow<IUser>()
  const { data, isLoading } = queryResult

  const record = data?.data

  const getStatusTag = (status: number) => {
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
  }

  return (
    <Show isLoading={isLoading}>
      {record && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <Avatar
              size={64}
              src={record.avatar}
              icon={<UserOutlined />}
              style={{ marginRight: 16 }}
            />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {record.nickName}
              </Title>
              <Typography.Text type="secondary">
                @
                {record.username}
              </Typography.Text>
            </div>
          </div>

          <Descriptions
            title="用户信息"
            bordered
            column={2}
            size="middle"
          >
            <Descriptions.Item label="用户ID">
              <TextField value={record.id} />
            </Descriptions.Item>

            <Descriptions.Item label="用户名">
              <TextField value={record.username} />
            </Descriptions.Item>

            <Descriptions.Item label="昵称">
              <TextField value={record.nickName} />
            </Descriptions.Item>

            <Descriptions.Item label="状态">
              {getStatusTag(record.status)}
            </Descriptions.Item>

            {record.builtIn !== undefined && (
              <Descriptions.Item label="内置用户">
                <Tag color={record.builtIn ? 'blue' : 'default'}>
                  {record.builtIn ? '是' : '否'}
                </Tag>
              </Descriptions.Item>
            )}

            <Descriptions.Item label="创建时间">
              <DateField value={record.createdAt} format="YYYY-MM-DD HH:mm:ss" />
            </Descriptions.Item>

            <Descriptions.Item label="更新时间">
              <DateField value={record.updatedAt} format="YYYY-MM-DD HH:mm:ss" />
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Show>
  )
}
