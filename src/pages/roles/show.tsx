import { useShow } from '@refinedev/core'

import { ShowView } from '@/components/refine-ui/views/show-view'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function RoleShow() {
  const { result: record } = useShow({})

  const getStatusInfo = (status: number) => {
    const statusMap = {
      '1': { label: '启用', variant: 'default' as const },
      '0': { label: '禁用', variant: 'secondary' as const },
    }
    return (
      statusMap[status as unknown as keyof typeof statusMap] || {
        label: '未知',
        variant: 'secondary' as const,
      }
    )
  }

  const statusInfo = record?.status ? getStatusInfo(record.status) : null

  return (
    <ShowView>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{record?.name}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-4">
                {statusInfo && (
                  <Badge variant={statusInfo.variant}>
                    {statusInfo.label}
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  ID:
                  {' '}
                  {record?.id}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">描述</h4>
              <p className="text-sm text-muted-foreground">
                {record?.description || '无描述'}
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">创建时间</h4>
              <p className="text-sm text-muted-foreground">
                {record?.createdAt
                  ? new Date(record.createdAt).toLocaleString()
                  : '-'}
              </p>
            </div>

            {record?.updatedAt && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">更新时间</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(record.updatedAt).toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ShowView>
  )
}

