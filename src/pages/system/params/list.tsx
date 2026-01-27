import { useTable } from '@refinedev/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import React from 'react'

import { DeleteButton } from '@/components/refine-ui/buttons/delete'
import { EditButton } from '@/components/refine-ui/buttons/edit'
import { ShowButton } from '@/components/refine-ui/buttons/show'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { DataTableFilterCombobox, DataTableFilterDropdownText } from '@/components/refine-ui/data-table/data-table-filter'
import { ListView, ListViewHeader } from '@/components/refine-ui/views/list-view'
import { Badge } from '@/components/ui/badge'

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
  createdAt: string | null
}

export function ParamList() {
  const columns = React.useMemo(() => {
    const columnHelper = createColumnHelper<Param>()

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
        id: 'key',
        accessorKey: 'key',
        header: ({ table }: { table: any }) => (
          <div className="flex items-center gap-1">
            参数键
            <DataTableFilterDropdownText
              column={table.getColumn('key')!}
              table={table}
              defaultOperator="contains"
              placeholder="搜索参数键..."
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
            参数名称
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
      columnHelper.accessor('value', {
        id: 'value',
        header: '参数值',
        enableSorting: false,
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <div className="max-w-xs truncate font-mono text-xs">
              {value}
            </div>
          )
        },
      }),
      columnHelper.accessor('valueType', {
        id: 'valueType',
        header: '值类型',
        enableSorting: false,
        cell: ({ getValue }) => {
          const valueType = getValue()
          const typeMap: Record<string, { label: string, variant: 'default' | 'secondary' | 'outline' }> = {
            [ValueType.STRING]: { label: '字符串', variant: 'default' },
            [ValueType.NUMBER]: { label: '数字', variant: 'secondary' },
            [ValueType.BOOLEAN]: { label: '布尔', variant: 'outline' },
            [ValueType.JSON]: { label: 'JSON', variant: 'secondary' },
          }
          const typeInfo = typeMap[valueType] || { label: valueType, variant: 'secondary' as const }
          return <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
        },
      }),
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
                { label: '启用', value: Status.ENABLED },
                { label: '禁用', value: Status.DISABLED },
              ]}
              placeholder="选择状态..."
            />
          </div>
        ),
        enableSorting: true,
        cell: ({ getValue }: { getValue: () => string }) => {
          const status = getValue()
          const statusMap = {
            [Status.ENABLED]: { label: '启用', variant: 'default' as const },
            [Status.DISABLED]: { label: '禁用', variant: 'secondary' as const },
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
      resource: 'system/params',
    },
  })

  return (
    <ListView>
      <ListViewHeader />
      <DataTable table={table} />
    </ListView>
  )
}
