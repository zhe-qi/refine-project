import { useTable } from '@refinedev/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'

import React from 'react'
import { DataTablePagination } from '@/components/refine-ui/data-table/data-table-pagination'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface Role {
  id: string
  name: string
  description: string | null
  status: number
  builtIn: boolean | null
  createdAt: string | null
}

interface RoleSelectTableProps {
  currentRoleIds: string[]
  onSelectionChange?: (selectedRoleIds: string[]) => void
}

export function RoleSelectTable({ currentRoleIds, onSelectionChange }: RoleSelectTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('')

  // 防抖搜索
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const columns = React.useMemo(() => {
    const columnHelper = createColumnHelper<Role>()

    return [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
              || (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value)
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value)
            }}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      }),
      columnHelper.accessor('name', {
        id: 'name',
        header: '角色名称',
        enableSorting: true,
        cell: ({ getValue }) => (
          <div className="font-medium">
            {getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('description', {
        id: 'description',
        header: '描述',
        enableSorting: false,
        cell: ({ getValue }) => {
          const desc = getValue()
          return desc || '-'
        },
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: '状态',
        enableSorting: true,
        cell: ({ getValue }) => {
          const status = getValue()
          const statusMap = {
            1: { label: '启用', variant: 'default' as const },
            0: { label: '禁用', variant: 'secondary' as const },
          }
          const statusInfo = statusMap[status as unknown as keyof typeof statusMap] || {
            label: '未知',
            variant: 'secondary' as const,
          }
          return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
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
    ]
  }, [])

  const table = useTable({
    columns,
    refineCoreProps: {
      syncWithLocation: false,
      resource: 'system/roles',
      filters: {
        permanent: debouncedSearchTerm
          ? [
              {
                field: 'q',
                operator: 'contains',
                value: debouncedSearchTerm,
              },
            ]
          : [],
      },
    },
    enableRowSelection: true,
    getRowId: (row) => row.id, // 使用角色 ID 作为行的唯一标识
  })

  const {
    reactTable,
    refineCore: {
      tableQuery,
      currentPage,
      setCurrentPage,
      pageCount,
      pageSize,
      setPageSize,
    },
  } = table

  const { getHeaderGroups, getRowModel } = reactTable
  const isLoading = tableQuery.isLoading

  // 监听选择变化
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = reactTable.getSelectedRowModel().rows
      const selectedRoleIds = selectedRows.map(row => row.original.id)
      onSelectionChange(selectedRoleIds)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactTable.getState().rowSelection, onSelectionChange, reactTable])

  // 初始化选中状态 - 当数据加载完成且有 currentRoleIds 时设置
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('=== 初始化选中状态 ===')
    // eslint-disable-next-line no-console
    console.log('tableQuery.data?.data:', tableQuery.data?.data)
    // eslint-disable-next-line no-console
    console.log('currentRoleIds:', currentRoleIds)

    if (tableQuery.data?.data && currentRoleIds.length > 0) {
      const rowSelection: Record<string, boolean> = {}
      currentRoleIds.forEach((roleId) => {
        // eslint-disable-next-line no-console
        console.log('设置选中:', roleId)
        rowSelection[roleId] = true
      })
      // eslint-disable-next-line no-console
      console.log('rowSelection:', rowSelection)
      // eslint-disable-next-line no-console
      console.log('当前选中状态:', reactTable.getState().rowSelection)
      reactTable.setRowSelection(rowSelection)
      // eslint-disable-next-line no-console
      console.log('设置后选中状态:', reactTable.getState().rowSelection)
    }
  }, [tableQuery.data?.data, currentRoleIds, reactTable])

  return (
    <div className={cn('flex', 'flex-col', 'gap-4')}>
      {/* 搜索框 */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="搜索角色名称..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          已选择
          {' '}
          {reactTable.getSelectedRowModel().rows.length}
          {' '}
          个角色
        </div>
      </div>

      {/* 表格 */}
      <div className={cn('rounded-md', 'border')}>
        <Table style={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHeader>
            {getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isPlaceholder = header.isPlaceholder

                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.column.getSize(),
                      }}
                    >
                      {isPlaceholder
                        ? null
                        : (
                            <div className={cn('flex', 'items-center', 'gap-1')}>
                              {typeof header.column.columnDef.header === 'function'
                                ? header.column.columnDef.header(header.getContext())
                                : header.column.columnDef.header}
                            </div>
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative">
            {isLoading
              ? (
                  <>
                    {Array.from({ length: pageSize < 1 ? 1 : pageSize }).map(
                      (_, rowIndex) => (
                        <TableRow
                          // eslint-disable-next-line react/no-array-index-key
                          key={`skeleton-row-${rowIndex}`}
                          aria-hidden="true"
                        >
                          {columns.map((_column, colIndex) => (
                            <TableCell
                              // eslint-disable-next-line react/no-array-index-key
                              key={`skeleton-cell-${rowIndex}-${colIndex}`}
                              className={cn('truncate')}
                            >
                              <div className="h-8" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ),
                    )}
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className={cn('absolute', 'inset-0', 'pointer-events-none')}
                      >
                        <Loader2
                          className={cn(
                            'absolute',
                            'top-1/2',
                            'left-1/2',
                            'animate-spin',
                            'text-primary',
                            'h-8',
                            'w-8',
                            '-translate-x-1/2',
                            '-translate-y-1/2',
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  </>
                )
              : getRowModel().rows?.length
                ? (
                    getRowModel().rows.map(row => (
                      <TableRow
                        key={row.original?.id ?? row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <TableCell key={cell.id}>
                              <div className="truncate">
                                {typeof cell.column.columnDef.cell === 'function'
                                  ? cell.column.columnDef.cell(cell.getContext())
                                  : cell.column.columnDef.cell}
                              </div>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))
                  )
                : (
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={columns.length}
                        className={cn('relative', 'text-center')}
                        style={{ height: '490px' }}
                      >
                        <div
                          className={cn(
                            'absolute',
                            'inset-0',
                            'flex',
                            'flex-col',
                            'items-center',
                            'justify-center',
                            'gap-2',
                            'bg-background',
                          )}
                        >
                          <div className={cn('text-lg', 'font-semibold', 'text-foreground')}>
                            暂无数据
                          </div>
                          <div className={cn('text-sm', 'text-muted-foreground')}>
                            当前没有角色数据
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      {!isLoading && getRowModel().rows?.length > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          pageCount={pageCount}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          total={tableQuery.data?.total}
        />
      )}
    </div>
  )
}
