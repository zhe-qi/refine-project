import React, { ReactNode } from 'react'
import { Card, Form, Row, Col, Button, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import type { FormInstance } from 'antd'

interface SearchFormProps {
  children: ReactNode
  form?: FormInstance
  onFinish?: (values: any) => void
  onReset?: () => void
  className?: string
  style?: React.CSSProperties
}

// 简单的搜索组件 - 无折叠功能
export function SearchForm({ 
  children, 
  form, 
  onFinish, 
  onReset,
  className,
  style 
}: SearchFormProps) {
  const handleReset = () => {
    form?.resetFields()
    onReset?.()
    // 重置后自动提交表单，触发重新搜索
    form?.submit()
  }

  return (
    <Card 
      className={className} 
      style={{ 
        marginBottom: 16,
        ...style 
      }}
      bodyStyle={{ 
        paddingBottom: 0 
      }}
    >
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        preserve={false}
      >
        <Row gutter={[16, 0]}>
          {children}
          <Col span={6}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SearchOutlined />}
              >
                搜索
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default SearchForm