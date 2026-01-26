import { useShow } from '@refinedev/core'
import { useParams } from 'react-router'

import { ShowView } from '@/components/refine-ui/views/show-view'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// 状态枚举
const Status = {
  ENABLED: 'ENABLED',
  DISABLED: 'DISABLED',
} as const

// 值类型枚举
const ValueType = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  JSON: 'JSON',
} as const

interface Param {
  id: string
  key: string
  value: string
  valueType: string
  name: string
  description: string | null
  status: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

export function ParamShow() {
  const { id } = useParams<{ id: string }>()

  const { result: param } = useShow<Param>({
    resource: 'system/param',
    id,
  })

  // eslint-disable-next-line react/no-nested-component-definitions
  const StatusBadge = ({ status }: { status: string }) => {
    const statusMap = {
      [Status.ENABLED]: { label: '启用', variant: 'default' as const },
      [Status.DISABLED]: { label: '禁用', variant: 'secondary' as const },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: '未知',
      variant: 'secondary' as const,
    }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  // eslint-disable-next-line react/no-nested-component-definitions
  const ValueTypeBadge = ({ valueType }: { valueType: string }) => {
    const typeMap: Record<string, { label: string, variant: 'default' | 'secondary' | 'outline' }> = {
      [ValueType.STRING]: { label: '字符串', variant: 'default' },
      [ValueType.NUMBER]: { label: '数字', variant: 'secondary' },
      [ValueType.BOOLEAN]: { label: '布尔', variant: 'outline' },
      [ValueType.JSON]: { label: 'JSON', variant: 'secondary' },
    }
    const typeInfo = typeMap[valueType] || { label: valueType, variant: 'secondary' as const }
    return <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
  }

  if (!param) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  // 格式化 JSON 值显示
  const formatValue = (value: string, valueType: string) => {
    if (valueType === ValueType.JSON) {
      try {
        return JSON.stringify(JSON.parse(value), null, 2)
      }
      catch {
        return value
      }
    }
    return value
  }

  return (
    <ShowView>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基础信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">参数键</p>
                <p className="font-mono">{param.key}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">参数名称</p>
                <p>{param.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">值类型</p>
                <ValueTypeBadge valueType={param.valueType} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">状态</p>
                <StatusBadge status={param.status} />
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-1">参数值</p>
                {param.valueType === ValueType.JSON
                  ? (
                      <pre className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto">
                        {formatValue(param.value, param.valueType)}
                      </pre>
                    )
                  : (
                      <p className="font-mono">{param.value}</p>
                    )}
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-1">参数描述</p>
                <p>{param.description || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">创建时间</p>
                <p>{new Date(param.createdAt).toLocaleString('zh-CN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">更新时间</p>
                <p>{new Date(param.updatedAt).toLocaleString('zh-CN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ShowView>
  )
}
