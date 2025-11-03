import { useCustomMutation, useInvalidate, useOne } from '@refinedev/core'
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RoleSelectTable } from './components/role-select-table'

interface User {
  id: string
  username: string
  nickName: string
  roles: { id: string, name: string }[]
}

export function UserAssignRoles() {
  const navigate = useNavigate()
  const { id: userId } = useParams<{ id: string }>()
  const [selectedRoleIds, setSelectedRoleIds] = React.useState<string[]>([])
  const invalidate = useInvalidate()

  // 获取用户信息
  const { query: { data: userData, isLoading: isLoadingUser } } = useOne<User>({
    resource: 'system/users',
    id: userId || '',
    queryOptions: { enabled: !!userId },
  })

  const user = userData?.data
  const currentRoleIds = React.useMemo(() => {
    const roleIds = user?.roles?.map(r => r.id) || []
    return roleIds
  }, [user])

  // 初始化选中的角色
  React.useEffect(() => {
    if (currentRoleIds.length > 0) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setSelectedRoleIds(currentRoleIds)
    }
  }, [currentRoleIds])

  const { mutation: { isPending }, mutate } = useCustomMutation()

  const handleConfirm = () => {
    if (!userId) {
      toast.error('用户 ID 不存在')
      return
    }

    mutate(
      {
        url: `/api/admin/system/users/${userId}/roles`,
        method: 'put',
        values: { roleIds: selectedRoleIds },
        successNotification: () => ({ message: '角色分配成功', type: 'success' }),
        errorNotification: () => ({ message: '角色分配失败', type: 'error' }),
      },
      {
        onSuccess: () => {
          invalidate({ resource: 'system/users', invalidates: ['list', 'detail'] })
          toast.success('角色分配成功')
          navigate('/system/users')
        },
        onError: (error) => {
          console.error('分配角色失败:', error)
          toast.error('角色分配失败')
        },
      },
    )
  }

  const handleCancel = () => {
    navigate('/system/users')
  }

  if (isLoadingUser) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-6">
            <div className="text-center text-muted-foreground">
              加载中...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-6">
            <div className="text-center text-muted-foreground">
              用户不存在
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            为用户
            {' '}
            &quot;
            {user.nickName || user.username}
            &quot;
            {' '}
            分配角色
          </CardTitle>
          <CardDescription>
            选择一个或多个角色分配给该用户
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleSelectTable
            currentRoleIds={currentRoleIds}
            onSelectionChange={setSelectedRoleIds}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isPending}>
              取消
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? '保存中...' : '确认分配'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
