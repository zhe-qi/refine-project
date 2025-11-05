import { useTable } from '@refinedev/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'

import { PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus } from '@/api/admin.d'
import { DeleteButton } from '@/components/refine-ui/buttons/delete'
import { EditButton } from '@/components/refine-ui/buttons/edit'
import { ShowButton } from '@/components/refine-ui/buttons/show'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { ListView, ListViewHeader } from '@/components/refine-ui/views/list-view'
import { Badge } from '@/components/ui/badge'
import { AssignRolesButton } from './components/assign-roles-button'

interface User {
  id: string
  username: string
  nickName: string
  avatar: string | null
  status: string
  builtIn: boolean | null
  createdAt: string | null
  roles: { id: string, name: string }[]
}

export function UserList() {
  const columns = React.useMemo(() => {
    const columnHelper = createColumnHelper<User>()

    return [
      columnHelper.accessor('id', {
        id: 'id',
        header: 'ID',
        enableSorting: false,
        cell: ({ getValue }) => (
          <div className="max-w-xs truncate font-mono text-xs">
            {getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('username', {
        id: 'username',
        header: '用户名',
        enableSorting: true,
      }),
      columnHelper.accessor('nickName', {
        id: 'nickName',
        header: '昵称',
        enableSorting: true,
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: '状态',
        enableSorting: true,
        cell: ({ getValue }) => {
          const status = getValue()
          const statusMap = {
            [PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus.ENABLED]: { label: '启用', variant: 'default' as const },
            [PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus.DISABLED]: { label: '禁用', variant: 'secondary' as const },
          }
          const statusInfo = statusMap[status as keyof typeof statusMap] || {
            label: '未知',
            variant: 'secondary' as const,
          }
          return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        },
      }),
      columnHelper.accessor('roles', {
        id: 'roles',
        header: '角色',
        enableSorting: false,
        cell: ({ getValue }) => {
          const roles = getValue()
          if (!roles || roles.length === 0)
            return '-'
          return (
            <div className="flex gap-1 flex-wrap">
              {roles.map(role => (
                <Badge key={role.id} variant="outline">
                  {role.name}
                </Badge>
              ))}
            </div>
          )
        },
      }),
      columnHelper.accessor('createdAt', {
        id: 'createdAt',
        header: '创建时间',
        enableSorting: true,
        cell: ({ getValue }) => {
          const date = getValue()
          return date ? new Date(date).toLocaleDateString() : '-'
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: '操作',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <EditButton recordItemId={row.original.id} size="sm" />
            <ShowButton recordItemId={row.original.id} size="sm" />
            <AssignRolesButton
              userId={row.original.id}
              currentRoles={row.original.roles || []}
            />
            {!row.original.builtIn && (
              <DeleteButton recordItemId={row.original.id} size="sm" />
            )}
          </div>
        ),
        enableSorting: false,
        size: 340,
      }),
    ]
  }, [])

  const table = useTable({
    columns,
    refineCoreProps: {
      syncWithLocation: true,
      resource: 'system/users',
    },
  })

  return (
    <ListView>
      <ListViewHeader />
      <DataTable table={table} />
    </ListView>
  )
}
