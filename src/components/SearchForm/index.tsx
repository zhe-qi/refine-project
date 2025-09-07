import React, { ReactNode } from 'react'
import { Card, Form, Row, Col, Button, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
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
  }

  return (
    <Card 
      className={className} 
      style={{ marginBottom: 16, ...style }}
      bodyStyle={{ paddingTop: 24, paddingBottom: 24 }}
    >
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        preserve={false}
        onReset={handleReset}
      >
        <Row gutter={16} align="middle">
          {children}
          <Col>
            <Form.Item style={{ marginBottom: 0 }}>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SearchOutlined />}
                >
                  搜索
                </Button>
                <Button htmlType="reset">
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default SearchForm