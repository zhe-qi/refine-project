import { useTable } from '@refinedev/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'

import { PathsApiAdminSystemDictGetParametersQueryStatus } from '@/api/admin.d'
import { DeleteButton } from '@/components/refine-ui/buttons/delete'
import { EditButton } from '@/components/refine-ui/buttons/edit'
import { ShowButton } from '@/components/refine-ui/buttons/show'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { DataTableFilterCombobox, DataTableFilterDropdownText } from '@/components/refine-ui/data-table/data-table-filter'
import { ListView, ListViewHeader } from '@/components/refine-ui/views/list-view'
import { Badge } from '@/components/ui/badge'

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
  createdAt: string | null
}

export function DictList() {
  const columns = React.useMemo(() => {
    const columnHelper = createColumnHelper<Dict>()

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
        id: 'code',
        accessorKey: 'code',
        header: ({ table }: { table: any }) => (
          <div className="flex items-center gap-1">
            字典编码
            <DataTableFilterDropdownText
              column={table.getColumn('code')!}
              table={table}
              defaultOperator="contains"
              placeholder="搜索编码..."
            />
          </div>
        ),
        enableSorting: true,
        cell: ({ getValue }: { getValue: () => string }) => (
          <div className="font-mono text-xs">
            {getValue()}
          </div>
        ),
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: ({ table }: { table: any }) => (
          <div className="flex items-center gap-1">
            字典名称
            <DataTableFilterDropdownText
              column={table.getColumn('name')!}
              table={table}
              defaultOperator="contains"
              placeholder="搜索名称..."
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
          const description = getValue()
          return description
            ? (
                <div className="max-w-xs truncate">
                  {description}
                </div>
              )
            : (
                '-'
              )
        },
      }),
      columnHelper.accessor('items', {
        id: 'items',
        header: '字典项数量',
        enableSorting: false,
        cell: ({ getValue }) => {
          const items = getValue()
          return (
            <div className="text-center">
              {items?.length || 0}
            </div>
          )
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
                { label: '启用', value: PathsApiAdminSystemDictGetParametersQueryStatus.ENABLED },
                { label: '禁用', value: PathsApiAdminSystemDictGetParametersQueryStatus.DISABLED },
              ]}
              placeholder="选择状态..."
            />
          </div>
        ),
        enableSorting: true,
        cell: ({ getValue }: { getValue: () => string }) => {
          const status = getValue()
          const statusMap = {
            [PathsApiAdminSystemDictGetParametersQueryStatus.ENABLED]: { label: '启用', variant: 'default' as const },
            [PathsApiAdminSystemDictGetParametersQueryStatus.DISABLED]: { label: '禁用', variant: 'secondary' as const },
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
            <ShowButton recordItemId={row.original.id} size="sm" />
            <EditButton recordItemId={row.original.id} size="sm" />
            <DeleteButton recordItemId={row.original.id} size="sm" />
          </div>
        ),
        enableSorting: false,
        size: 300,
      }),
    ]
  }, [])

  const table = useTable({
    columns,
    refineCoreProps: {
      syncWithLocation: true,
      resource: 'system/dict',
    },
  })

  return (
    <ListView>
      <ListViewHeader />
      <DataTable table={table} />
    </ListView>
  )
}
