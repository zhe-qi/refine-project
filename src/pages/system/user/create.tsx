import { Create, useForm } from '@refinedev/antd'
import { Card, Form, Input, Select } from 'antd'
import { R2AvatarUpload } from '@/components/R2Upload'

interface IUserCreateForm {
  username: string
  password: string
  nickName: string
  avatar?: string
  status?: number
}

export function UserCreate() {
  const { formProps, saveButtonProps, form } = useForm<IUserCreateForm>()

  const handleAvatarUpload = (url: string) => {
    form?.setFieldsValue({ avatar: url })
  }

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Card title="基本信息">
          <Form.Item
            label="头像"
            name="avatar"
          >
            <R2AvatarUpload
              onSuccess={(result) => {
                handleAvatarUpload(result.url)
              }}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { max: 20, message: '用户名最多20个字符' },
              {
                pattern: /^\w+$/,
                message: '用户名只能包含字母、数字和下划线',
              },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label="昵称"
            name="nickName"
            rules={[
              { required: true, message: '请输入昵称' },
              { max: 50, message: '昵称最多50个字符' },
            ]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            initialValue={1}
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
              <Select.Option value={-1}>封禁</Select.Option>
            </Select>
          </Form.Item>
        </Card>
      </Form>
    </Create>
  )
}
