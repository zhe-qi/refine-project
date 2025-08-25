import type { CapWidgetRef } from '@/components'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useLogin } from '@refinedev/core'
import { Alert, Button, Card, Form, Input, theme, Typography } from 'antd'
import { useRef, useState } from 'react'
import { CapWidget } from '@/components'

const { Title, Text } = Typography

export function Login() {
  const { mutate: login, isPending, error } = useLogin()
  const [form] = Form.useForm()
  const [captchaToken, setCaptchaToken] = useState<string>('')
  const capWidgetRef = useRef<CapWidgetRef>(null)

  // 获取当前主题 token
  const { token } = theme.useToken()

  const onFinish = (values: { username: string, password: string }) => {
    if (!captchaToken) {
      return
    }

    login({
      username: values.username,
      password: values.password,
      captchaToken,
    }, {
      onSuccess: () => {
        // 登录成功后重置验证码状态
        capWidgetRef.current?.reset()
        setCaptchaToken('')
      },
      onError: () => {
        // 登录失败后重置验证码状态
        capWidgetRef.current?.reset()
        setCaptchaToken('')
      }
    })
  }

  const handleCaptchaSolve = (token: string) => {
    setCaptchaToken(token)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: token.colorBgLayout, // 使用主题背景色
    }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: 12,
          border: 'none',
        }}
        styles={{ body: { padding: '32px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>
            登录
          </Title>
          <Text type="secondary">
            欢迎回来，请输入您的账户信息
          </Text>
        </div>

        {error && (
          <Alert
            message="登录失败"
            description={error.message}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <CapWidget
              ref={capWidgetRef}
              onSolve={handleCaptchaSolve}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              disabled={!captchaToken}
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
