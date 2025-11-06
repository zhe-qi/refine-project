import { useShow } from '@refinedev/core'

import { PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus } from '@/api/admin.d'
import { ShowView } from '@/components/refine-ui/views/show-view'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getImageUrl } from '@/utils/upload'

export function UserShow() {
  const { result: record } = useShow({})

  const getStatusInfo = (status: string) => {
    const statusMap = {
      [PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus.ENABLED]: { label: '启用', variant: 'default' as const },
      [PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus.DISABLED]: { label: '禁用', variant: 'secondary' as const },
    }
    return (
      statusMap[status as keyof typeof statusMap] || {
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
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={getImageUrl(record?.avatar || '')} alt={record?.nickName} />
                <AvatarFallback>
                  {record?.nickName?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle>{record?.nickName}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-4 mt-2">
                    {statusInfo && (
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    )}
                    {record?.builtIn && (
                      <Badge variant="outline">内置用户</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      ID:
                      {' '}
                      {record?.id}
                    </span>
                  </div>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">用户名</h4>
              <p className="text-sm text-muted-foreground">
                {record?.username || '-'}
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">角色</h4>
              {record?.roles && record.roles.length > 0
                ? (
                    <div className="flex gap-2 flex-wrap">
                      {record.roles.map((role: { id: string, name: string }) => (
                        <Badge key={role.id} variant="outline">
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  )
                : (
                    <p className="text-sm text-muted-foreground">未分配角色</p>
                  )}
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
