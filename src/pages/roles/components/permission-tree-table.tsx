/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect */
import type { IResourceItem } from '@refinedev/core'
import type {
  ColumnDef,
  ExpandedState,
} from '@tanstack/react-table'
import { useResourceParams } from '@refinedev/core'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

// 权限节点类型
type PermissionNodeType = 'parent' | 'resource' | 'permission'

// 权限节点接口
interface PermissionNode {
  id: string
  type: PermissionNodeType
  label: string
  resourcePath?: string
  action?: string
  method?: string
  children?: PermissionNode[]
}

interface PermissionTreeTableProps {
  currentPermissions: [string, string][]
  onSelectionChange?: (selectedPermissions: [string, string][]) => void
  isLoading?: boolean
}

export function PermissionTreeTable({
  currentPermissions,
  onSelectionChange,
  isLoading = false,
}: PermissionTreeTableProps) {
  const { resources } = useResourceParams()
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [initialPermissions, setInitialPermissions] = React.useState<[string, string][]>([])
  const [selectedPermissions, setSelectedPermissions] = React.useState<Set<string>>(() => new Set())

  // 将权限数组转换为 Set 的 key
  const permissionToKey = (resource: string, action: string) => `${resource}:${action}`

  // 构建树形数据结构
  const buildTreeData = React.useCallback((): PermissionNode[] => {
    if (!resources)
      return []

    const treeData: PermissionNode[] = []
    const parentMap = new Map<string, PermissionNode>()

    // 获取所有父资源（没有 parent 的资源）
    const parentResources = resources.filter((r: IResourceItem) => !r.meta?.parent)

    parentResources.forEach((parentResource: IResourceItem) => {
      const parentNode: PermissionNode = {
        id: parentResource.name,
        type: 'parent',
        label: parentResource.meta?.label || parentResource.name,
        children: [],
      }
      parentMap.set(parentResource.name, parentNode)
      treeData.push(parentNode)
    })

    // 处理子资源
    resources.forEach((resource: IResourceItem) => {
      // 跳过父资源本身
      if (!resource.meta?.parent)
        return

      const parentNode = parentMap.get(resource.meta.parent)
      if (!parentNode)
        return

      const resourceNode: PermissionNode = {
        id: resource.name,
        type: 'resource',
        label: resource.meta?.label || resource.name,
        children: [],
      }

      // 从 list 路径推导出基础 API 路径
      // 例如: /system/users -> /system/users
      const basePath = resource.list ? (resource.list as string).replace(/:(\w+)/g, '{$1}') : null

      if (!basePath)
        return

      // 用于去重的 Set（同一个路径+方法组合只添加一次）
      const addedPermissions = new Set<string>()

      // 添加标准 CRUD 权限（基于 API 路径，不是前端路由）
      const crudPermissions: Array<{ path: string, method: string, label: string }> = [
        { path: basePath, method: 'GET', label: '查看权限' },
        { path: basePath, method: 'POST', label: '新增权限' },
        { path: `${basePath}/{id}`, method: 'GET', label: '查看详情权限' },
        { path: `${basePath}/{id}`, method: 'PATCH', label: '编辑权限' },
      ]

      // 添加删除权限
      if (resource.meta?.canDelete) {
        crudPermissions.push({
          path: `${basePath}/{id}`,
          method: 'DELETE',
          label: '删除权限',
        })
      }

      crudPermissions.forEach(({ path, method, label }) => {
        const permKey = `${path}:${method}`

        if (!addedPermissions.has(permKey)) {
          addedPermissions.add(permKey)
          resourceNode.children!.push({
            id: `${resource.name}-${path}-${method}`,
            type: 'permission',
            label,
            resourcePath: path,
            action: method,
            method,
          })
        }
      })

      // 添加自定义 actions
      if (resource.meta?.customActions) {
        Object.entries(resource.meta.customActions).forEach(([actionName, actionConfig]) => {
          const { path, method } = actionConfig as { path: string, method: string }
          const permKey = `${path}:${method}`

          if (!addedPermissions.has(permKey)) {
            addedPermissions.add(permKey)
            resourceNode.children!.push({
              id: `${resource.name}-${path}-${method}`,
              type: 'permission',
              label: actionName,
              resourcePath: path,
              action: method,
              method,
            })
          }
        })
      }

      if (resourceNode.children!.length > 0) {
        parentNode.children!.push(resourceNode)
      }
    })

    return treeData
  }, [resources])

  const treeData = React.useMemo(() => buildTreeData(), [buildTreeData])

  // 获取所有可能的权限（扁平化并去重）
  const allPermissions = React.useMemo(() => {
    const permsMap = new Map<string, [string, string]>()
    const traverse = (nodes: PermissionNode[]) => {
      nodes.forEach((node) => {
        if (node.type === 'permission' && node.resourcePath && node.action) {
          const key = permissionToKey(node.resourcePath, node.action)
          if (!permsMap.has(key)) {
            permsMap.set(key, [node.resourcePath, node.action])
          }
        }
        if (node.children) {
          traverse(node.children)
        }
      })
    }
    traverse(treeData)
    const result = Array.from(permsMap.values())
    // eslint-disable-next-line no-console
    console.warn('=== allPermissions 去重后 ===')
    // eslint-disable-next-line no-console
    console.warn('总数:', result.length)
    // eslint-disable-next-line no-console
    console.warn('权限列表:', result)
    return result
  }, [treeData])

  // 初始化选中状态
  React.useEffect(() => {
    const permSet = new Set(currentPermissions.map(([r, a]) => permissionToKey(r, a)))
    // eslint-disable-next-line no-console
    console.warn('=== 初始化选中状态 ===')
    // eslint-disable-next-line no-console
    console.warn('currentPermissions:', currentPermissions)
    // eslint-disable-next-line no-console
    console.warn('permSet size:', permSet.size)
    // eslint-disable-next-line no-console
    console.warn('permSet:', Array.from(permSet))

    // 找出哪些权限在 currentPermissions 中但不在 allPermissions 中
    const allPermSet = new Set(allPermissions.map(([r, a]) => permissionToKey(r, a)))
    const missing = Array.from(permSet).filter(key => !allPermSet.has(key))
    // eslint-disable-next-line no-console
    console.warn('在 API 中但不在树中的权限:', missing)

    setInitialPermissions(currentPermissions)
    setSelectedPermissions(permSet)
  }, [currentPermissions, allPermissions])

  // 监听选择变化并通知父组件
  React.useEffect(() => {
    if (onSelectionChange) {
      const perms: [string, string][] = Array.from(selectedPermissions)
        .map((key) => {
          const [resource, action] = key.split(':')
          return [resource, action] as [string, string]
        })
        .filter(([resource, action]) => resource && action)
      onSelectionChange(perms)
    }
  }, [selectedPermissions, onSelectionChange])

  // 获取节点的所有子权限
  const getNodePermissions = React.useCallback((node: PermissionNode): [string, string][] => {
    const perms: [string, string][] = []
    const traverse = (n: PermissionNode) => {
      if (n.type === 'permission' && n.resourcePath && n.action) {
        perms.push([n.resourcePath, n.action])
      }
      if (n.children) {
        n.children.forEach(traverse)
      }
    }
    traverse(node)
    return perms
  }, [])

  // 检查节点选中状态
  const getNodeCheckState = React.useCallback((node: PermissionNode): boolean | 'indeterminate' => {
    if (node.type === 'permission' && node.resourcePath && node.action) {
      return selectedPermissions.has(permissionToKey(node.resourcePath, node.action))
    }

    const childPerms = getNodePermissions(node)
    if (childPerms.length === 0)
      return false

    const selectedCount = childPerms.filter(([r, a]) =>
      selectedPermissions.has(permissionToKey(r, a)),
    ).length

    if (selectedCount === 0)
      return false
    if (selectedCount === childPerms.length)
      return true
    return 'indeterminate'
  }, [selectedPermissions, getNodePermissions])

  // 切换节点选中状态
  const toggleNode = React.useCallback((node: PermissionNode) => {
    const childPerms = getNodePermissions(node)
    const checkState = getNodeCheckState(node)

    setSelectedPermissions((prev) => {
      const next = new Set(prev)
      if (checkState === true) {
        // 取消选中所有子权限
        childPerms.forEach(([r, a]) => next.delete(permissionToKey(r, a)))
      }
      else {
        // 选中所有子权限
        childPerms.forEach(([r, a]) => next.add(permissionToKey(r, a)))
      }
      return next
    })
  }, [getNodePermissions, getNodeCheckState])

  // 批量操作
  const selectAll = React.useCallback(() => {
    const allKeys = allPermissions.map(([r, a]) => permissionToKey(r, a))
    setSelectedPermissions(new Set(allKeys))
  }, [allPermissions])

  const toggleAll = React.useCallback(() => {
    setSelectedPermissions((prev) => {
      const next = new Set<string>()
      allPermissions.forEach(([r, a]) => {
        const key = permissionToKey(r, a)
        if (!prev.has(key)) {
          next.add(key)
        }
      })
      return next
    })
  }, [allPermissions])

  const reset = React.useCallback(() => {
    const permSet = new Set(initialPermissions.map(([r, a]) => permissionToKey(r, a)))
    setSelectedPermissions(permSet)
  }, [initialPermissions])

  // 定义列
  const columns = React.useMemo<ColumnDef<PermissionNode>[]>(
    () => [
      {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => {
          const canExpand = row.getCanExpand()
          if (!canExpand) {
            return <div className="w-6" />
          }
          return (
            <button
              type="button"
              onClick={row.getToggleExpandedHandler()}
              className="flex items-center justify-center w-6 h-6"
            >
              {row.getIsExpanded()
                ? (
                    <ChevronDown className="h-4 w-4" />
                  )
                : (
                    <ChevronRight className="h-4 w-4" />
                  )}
            </button>
          )
        },
        size: 40,
      },
      {
        id: 'select',
        header: () => {
          const allSelected = allPermissions.every(([r, a]) =>
            selectedPermissions.has(permissionToKey(r, a)),
          )
          const someSelected = allPermissions.some(([r, a]) =>
            selectedPermissions.has(permissionToKey(r, a)),
          )

          return (
            <Checkbox
              checked={allSelected ? true : someSelected ? 'indeterminate' : false}
              onCheckedChange={(checked) => {
                if (checked) {
                  selectAll()
                }
                else {
                  setSelectedPermissions(new Set())
                }
              }}
              aria-label="Select all"
            />
          )
        },
        cell: ({ row }) => {
          const checkState = getNodeCheckState(row.original)
          return (
            <Checkbox
              checked={checkState}
              onCheckedChange={() => toggleNode(row.original)}
              aria-label="Select row"
            />
          )
        },
        size: 40,
      },
      {
        id: 'label',
        header: '权限名称',
        cell: ({ row }) => {
          const { type, label } = row.original
          const depth = row.depth
          const paddingLeft = depth * 24

          return (
            <div
              className={cn('flex items-center', {
                'font-semibold': type === 'parent',
                'font-medium': type === 'resource',
              })}
              style={{ paddingLeft }}
            >
              {label}
            </div>
          )
        },
      },
      {
        id: 'path',
        header: '资源路径',
        cell: ({ row }) => {
          const { type, resourcePath } = row.original
          if (type === 'permission' && resourcePath) {
            return <div className="text-sm text-muted-foreground font-mono">{resourcePath}</div>
          }
          return null
        },
      },
      {
        id: 'method',
        header: '方法',
        cell: ({ row }) => {
          const { type, method } = row.original
          if (type === 'permission' && method) {
            return (
              <div className={cn('text-sm font-mono', {
                'text-green-600': method === 'GET',
                'text-blue-600': method === 'POST',
                'text-yellow-600': method === 'PATCH',
                'text-orange-600': method === 'PUT',
                'text-red-600': method === 'DELETE',
              })}
              >
                {method}
              </div>
            )
          }
          return null
        },
        size: 80,
      },
    ],
    [allPermissions, selectedPermissions, getNodeCheckState, toggleNode, selectAll],
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: treeData,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={selectAll}>
            全选
          </Button>
          <Button size="sm" variant="outline" onClick={toggleAll}>
            反选
          </Button>
          <Button size="sm" variant="outline" onClick={reset}>
            重置
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          已选择
          {' '}
          {selectedPermissions.size}
          {' '}
          /
          {' '}
          {allPermissions.length}
          {' '}
          个权限
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.column.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      data-state={getNodeCheckState(row.original) === true && 'selected'}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
              : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      暂无权限数据
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
