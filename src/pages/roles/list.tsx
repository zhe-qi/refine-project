import { useTable } from '@refinedev/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'

import { PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus } from '@/api/admin.d'
import { DeleteButton } from '@/components/refine-ui/buttons/delete'
import { EditButton } from '@/components/refine-ui/buttons/edit'
import { ShowButton } from '@/components/refine-ui/buttons/show'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { DataTableFilterDropdownText, DataTableFilterCombobox } from '@/components/refine-ui/data-table/data-table-filter'
import { ListView, ListViewHeader } from '@/components/refine-ui/views/list-view'
import { Badge } from '@/components/ui/badge'
import { AssignPermissionsButton } from './components/assign-permissions-button'

interface Role {
  id: string
  name: string
  description: string | null
  status: string
  createdAt: string | null
}

export function RoleList() {
  const columns = React.useMemo(() => {
    const columnHelper = createColumnHelper<Role>()

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
      {
        id: 'name',
        accessorKey: 'name',
        header: ({ table }: { table: any }) => (
          <div className="flex items-center gap-1">
            角色名称
            <DataTableFilterDropdownText
              column={table.getColumn('name')!}
              table={table}
              defaultOperator="contains"
              placeholder="搜索角色名称..."
            />
          </div>
        ),
        enableSorting: true,
      },
      columnHelper.accessor('description', {
        id: 'description',
        header: '描述',
        enableSorting: false,
        cell: ({ getValue }) => {
          const desc = getValue()
          if (!desc)
            return '-'
          return <div className="max-w-xs truncate">{desc}</div>
        },
      }),
      {
        id: 'status',
        accessorKey: 'status',
        header: ({ table }: { table: any }) => (
          <div className="flex items-center gap-1">
            状态
            <DataTableFilterCombobox
              column={table.getColumn('status')!}
              table={table}
              defaultOperator="eq"
              options={[
                { label: '启用', value: PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus.ENABLED },
                { label: '禁用', value: PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus.DISABLED },
              ]}
              placeholder="选择状态..."
            />
          </div>
        ),
        enableSorting: true,
        cell: ({ getValue }: { getValue: () => string }) => {
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
      },
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
            <AssignPermissionsButton
              roleId={row.original.id}
              roleName={row.original.name}
            />
            <EditButton recordItemId={row.original.id} size="sm" />
            <ShowButton recordItemId={row.original.id} size="sm" />
            <DeleteButton recordItemId={row.original.id} size="sm" />
          </div>
        ),
        enableSorting: false,
        size: 290,
      }),
    ]
  }, [])

  const table = useTable({
    columns,
    refineCoreProps: {
      syncWithLocation: true,
      resource: 'system/roles',
    },
  })

  return (
    <ListView>
      <ListViewHeader />
      <DataTable table={table} />
    </ListView>
  )
}

