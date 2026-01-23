import { useCustom, useCustomMutation, useInvalidate, useOne } from '@refinedev/core'
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getEnforcer } from '@/providers/access-control'
import { PermissionTreeTable } from './components/permission-tree-table'

interface Role {
  id: string
  name: string
  description: string | null
}

interface PermissionItem {
  resource: string
  action: string
}

interface Grouping {
  child: string
  parent: string
}

interface PermissionsResponse {
  permissions: PermissionItem[]
  groupings: Grouping[]
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
      if (seen.has(key))
        return false
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
  const { query: { data: permissionsData, isLoading: isLoadingPermissions } } = useCustom<PermissionsResponse>({
    url: `/api/admin/system/roles/${roleId}/permissions`,
    method: 'get',
    queryOptions: {
      enabled: !!roleId,
    },
  })

  const role = roleData?.data

  // 使用 casbin 计算继承权限
  const { currentPermissions } = React.useMemo(() => {
    const permissions = permissionsData?.data?.permissions || []

    // 转换权限格式
    const current: [string, string][] = permissions.map(perm => [perm.resource, perm.action])

    return { currentPermissions: current }
  }, [permissionsData?.data])

  // 使用 casbin enforcer 计算继承权限
  // eslint-disable-next-line react/prefer-use-state-lazy-initialization
  const [inheritedPermsSet, setInheritedPermsSet] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    if (!roleId) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setInheritedPermsSet(new Set())
      return
    }

    const calculateInheritedPermissions = async () => {
      try {
        // 使用共享的 enforcer 实例
        const enforcer = await getEnforcer()

        // 获取直接权限（只属于该角色的）
        const directPermissions = await enforcer.getPermissionsForUser(roleId)

        // 获取所有隐式权限（包括继承的）
        const allImplicitPermissions = await enforcer.getImplicitPermissionsForUser(roleId)

        // 构建直接权限集合
        const directPermSet = new Set(
          directPermissions.map(p => `${p[1]}:${p[2]}`),
        )

        // 继承的权限 = 所有权限 - 直接权限
        const inherited = new Set<string>()
        allImplicitPermissions.forEach((p) => {
          const key = `${p[1]}:${p[2]}`
          if (!directPermSet.has(key)) {
            inherited.add(key)
          }
        })

        setInheritedPermsSet(inherited)
      }
      catch (error) {
        console.error('计算继承权限失败:', error)
        setInheritedPermsSet(new Set())
      }
    }

    calculateInheritedPermissions()
  }, [roleId, permissionsData?.data])

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

    // 过滤掉继承的权限，只传入直接权限
    const directPermissions = selectedPermissions.filter(([resource, action]) => {
      const key = `${resource}:${action}`
      return !inheritedPermsSet.has(key)
    })

    mutate(
      {
        url: `/api/admin/system/roles/${roleId}/permissions`,
        method: 'put',
        values: { permissions: directPermissions },
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
            inheritedPermissions={inheritedPermsSet}
            onSelectionChange={perms => setSelectedPermissions(dedupePermissions(perms))}
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
