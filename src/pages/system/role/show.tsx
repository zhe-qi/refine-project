import { Show } from '@refinedev/antd'
import { useShow } from '@refinedev/core'
import { Card, Descriptions, Tag, Typography } from 'antd'

const { Text } = Typography

interface IRole {
  id: string
  name: string
  description?: string
  status: number
  createdAt: string
  updatedAt: string
}

export function RoleShow() {
  const { query } = useShow<IRole>()
  const { data, isLoading } = query

  const record = data?.data

  const statusConfig = {
    1: { color: 'green', text: '启用' },
    0: { color: 'orange', text: '禁用' },
  }

  const getStatusConfig = (status: number) => {
    return statusConfig[status as keyof typeof statusConfig] || {
      color: 'default',
      text: '未知',
    }
  }

  return (
    <Show isLoading={isLoading} title="查看角色">
      <Card title="角色信息" style={{ marginBottom: 16 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="ID" span={1}>
            <Text copyable>{record?.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="角色ID" span={1}>
            <Text code>{record?.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="角色名称" span={1}>
            <Text strong>{record?.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="状态" span={1}>
            {record?.status !== undefined && (
              <Tag color={getStatusConfig(record.status).color}>
                {getStatusConfig(record.status).text}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="角色描述" span={2}>
            <Text>{record?.description || '暂无描述'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={1}>
            <Text>
              {record?.createdAt
                ? new Date(record.createdAt).toLocaleString('zh-CN')
                : '-'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="更新时间" span={1}>
            <Text>
              {record?.updatedAt
                ? new Date(record.updatedAt).toLocaleString('zh-CN')
                : '-'}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  )
}
