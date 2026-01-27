import { useShow } from '@refinedev/core'
import { useParams } from 'react-router'

import { PathsApiAdminSystemDictsGetParametersQueryStatus } from '@/api/admin.d'
import { ShowView } from '@/components/refine-ui/views/show-view'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DictItem {
  label: string
  value: string
  sort: number
  disabled?: boolean
  color?: string
}

interface Dict {
  id: string
  code: string
  name: string
  description: string | null
  items: DictItem[]
  status: string
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

export function DictShow() {
  const { id } = useParams<{ id: string }>()

  const { result: dict } = useShow<Dict>({
    resource: 'system/dicts',
    id,
  })

  // eslint-disable-next-line react/no-nested-component-definitions
  const StatusBadge = ({ status }: { status: string }) => {
    const statusMap = {
      [PathsApiAdminSystemDictsGetParametersQueryStatus.ENABLED]: { label: '启用', variant: 'default' as const },
      [PathsApiAdminSystemDictsGetParametersQueryStatus.DISABLED]: { label: '禁用', variant: 'secondary' as const },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: '未知',
      variant: 'secondary' as const,
    }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  if (!dict) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
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
                <p className="text-sm text-muted-foreground mb-1">字典编码</p>
                <p className="font-mono">{dict.code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">字典名称</p>
                <p>{dict.name}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-1">字典描述</p>
                <p>{dict.description || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">状态</p>
                <StatusBadge status={dict.status} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">字典项数量</p>
                <p>{dict.items.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">创建时间</p>
                <p>{new Date(dict.createdAt).toLocaleString('zh-CN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">更新时间</p>
                <p>{new Date(dict.updatedAt).toLocaleString('zh-CN')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>字典项列表</CardTitle>
          </CardHeader>
          <CardContent>
            {dict.items.length === 0
              ? (
                  <div className="text-center text-muted-foreground py-8">
                    暂无字典项
                  </div>
                )
              : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>排序</TableHead>
                        <TableHead>显示文本</TableHead>
                        <TableHead>字典值</TableHead>
                        <TableHead>颜色</TableHead>
                        <TableHead>状态</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dict.items
                        .sort((a, b) => a.sort - b.sort)
                        .map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.sort}</TableCell>
                            <TableCell>{item.label}</TableCell>
                            <TableCell className="font-mono">{item.value}</TableCell>
                            <TableCell>
                              {item.color
                                ? (
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-6 h-6 rounded border"
                                        style={{ backgroundColor: item.color }}
                                      />
                                      <span className="text-sm">{item.color}</span>
                                    </div>
                                  )
                                : (
                                    '-'
                                  )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={item.disabled ? 'secondary' : 'default'}>
                                {item.disabled ? '禁用' : '启用'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
          </CardContent>
        </Card>
      </div>
    </ShowView>
  )
}
