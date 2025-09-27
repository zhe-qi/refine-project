import { Create, useForm } from '@refinedev/antd'
import { Card, Form, Input, Switch } from 'antd'

interface IRoleCreateForm {
  id: string
  name: string
  description?: string
  status?: number
}

export function RoleCreate() {
  const { formProps, saveButtonProps } = useForm<IRoleCreateForm>()

  return (
    <Create
      saveButtonProps={saveButtonProps}
      title="创建角色"
    >
      <Form {...formProps} layout="vertical">
        <Card title="基本信息">
          <Form.Item
            label="角色ID"
            name="id"
            rules={[
              { required: true, message: '请输入角色ID' },
              { min: 2, message: '角色ID至少2个字符' },
              { max: 50, message: '角色ID最多50个字符' },
              {
                pattern: /^[a-z][\w-]*$/i,
                message: '角色ID只能以字母开头，包含字母、数字、下划线和短横线',
              },
            ]}
          >
            <Input placeholder="请输入角色ID，如：admin, editor" />
          </Form.Item>

          <Form.Item
            label="角色名称"
            name="name"
            rules={[
              { required: true, message: '请输入角色名称' },
              { min: 2, message: '角色名称至少2个字符' },
              { max: 100, message: '角色名称最多100个字符' },
            ]}
          >
            <Input placeholder="请输入角色名称，如：管理员、编辑者" />
          </Form.Item>

          <Form.Item
            label="角色描述"
            name="description"
            rules={[
              { max: 500, message: '角色描述最多500个字符' },
            ]}
          >
            <Input.TextArea
              placeholder="请输入角色描述（可选）"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            valuePropName="checked"
            getValueFromEvent={checked => checked ? 1 : 0}
            getValueProps={value => ({ checked: value === 1 })}
            initialValue={1}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Card>
      </Form>
    </Create>
  )
}
