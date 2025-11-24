import { useCustom, useCustomMutation, useInvalidate, useOne } from '@refinedev/core'
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PermissionTreeTable } from './components/permission-tree-table'

interface Role {
  id: string
  name: string
  description: string | null
}

interface PermissionItem {
  resource: string
  action: string
  inherited: boolean
}

export function RoleAssignPermissions() {
  const navigate = useNavigate()
  const { id: roleId } = useParams<{ id: string }>()
  const [selectedPermissions, setSelectedPermissions] = React.useState<[string, string][]>([])
  const invalidate = useInvalidate()

  // 去重函数
  const dedupePermissions = React.useCallback((perms: [string, string][]) => {
    const seen = new Set<string>()
    return perms.filter(([resource, action]) => {
      const key = `${resource}:${action}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [])

  // 获取角色信息
  const { query: { data: roleData, isLoading: isLoadingRole } } = useOne<Role>({
    resource: 'system/roles',
    id: roleId || '',
    queryOptions: { enabled: !!roleId },
  })

  // 获取角色当前权限
  const { query: { data: permissionsData, isLoading: isLoadingPermissions } } = useCustom<PermissionItem[]>({
    url: `/api/admin/system/roles/${roleId}/permissions`,
    method: 'get',
    queryOptions: {
      enabled: !!roleId,
    },
  })

  const role = roleData?.data

  // 处理权限数据
  const { currentPermissions, inheritedPermissions } = React.useMemo(() => {
    const permissions = permissionsData?.data || []

    // 分离直接权限和继承权限
    const current: [string, string][] = []
    const inherited = new Set<string>()

    permissions.forEach((perm) => {
      const key = `${perm.resource}:${perm.action}`
      current.push([perm.resource, perm.action])
      if (perm.inherited) {
        inherited.add(key)
      }
    })

    return { currentPermissions: current, inheritedPermissions: inherited }
  }, [permissionsData?.data])

  // 初始化选中的权限
  React.useEffect(() => {
    if (currentPermissions.length > 0) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setSelectedPermissions(dedupePermissions(currentPermissions))
    }
  }, [currentPermissions, dedupePermissions])

  const { mutation: { isPending }, mutate } = useCustomMutation()

  const handleConfirm = () => {
    if (!roleId) {
      toast.error('角色 ID 不存在')
      return
    }

    mutate(
      {
        url: `/api/admin/system/roles/${roleId}/permissions`,
        method: 'put',
        values: { permissions: selectedPermissions },
        successNotification: () => ({ message: '权限分配成功', type: 'success' }),
        errorNotification: () => ({ message: '权限分配失败', type: 'error' }),
      },
      {
        onSuccess: () => {
          invalidate({ resource: 'system/roles', invalidates: ['list', 'detail'] })
          toast.success('权限分配成功')
          navigate('/system/roles')
        },
        onError: (error) => {
          console.error('分配权限失败:', error)
          toast.error('权限分配失败')
        },
      },
    )
  }

  const handleCancel = () => {
    navigate('/system/roles')
  }

  const isLoading = isLoadingRole || isLoadingPermissions

  if (isLoading) {
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

  if (!role) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="py-6">
            <div className="text-center text-muted-foreground">
              角色不存在
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
            为角色
            {' '}
            &quot;
            {role.name}
            &quot;
            {' '}
            分配权限
          </CardTitle>
          <CardDescription>
            选择该角色可以访问的资源和操作权限
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PermissionTreeTable
            currentPermissions={currentPermissions}
            inheritedPermissions={inheritedPermissions}
            onSelectionChange={(perms) => setSelectedPermissions(dedupePermissions(perms))}
            isLoading={isLoading}
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
