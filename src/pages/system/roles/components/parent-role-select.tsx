import { useList } from '@refinedev/core'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface ParentRoleSelectProps {
  value: string[]
  onChange: (ids: string[]) => void
  excludeRoleId?: string
  disabled?: boolean
}

interface RoleOption {
  id: string
  name: string
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export function ParentRoleSelect({
  value = [],
  onChange,
  excludeRoleId,
  disabled = false,
}: ParentRoleSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebouncedValue(searchText, 300)

  const listResult = useList<RoleOption>({
    resource: 'system/roles',
    filters: debouncedSearchText
      ? [{ field: 'name', operator: 'contains', value: debouncedSearchText }]
      : [],
    pagination: {
      pageSize: 50,
    },
  })

  // Refine 的 useList 返回 { query, result, overtime }
  // query 是 React Query 的查询对象，data.data 是实际的角色列表
  const rolesData = listResult.query?.data?.data || []
  const isLoading = listResult.query?.isLoading || false

  const availableRoles = useMemo(() => {
    return excludeRoleId
      ? rolesData.filter((role: RoleOption) => role.id !== excludeRoleId)
      : rolesData
  }, [rolesData, excludeRoleId])

  const selectedRoles = useMemo(() => {
    return availableRoles.filter((role: RoleOption) => value.includes(role.id))
  }, [availableRoles, value])

  // 获取用于显示的角色列表（如果 API 还没加载完，就显示 ID）
  const displayRoles = useMemo(() => {
    if (selectedRoles.length > 0) {
      return selectedRoles
    }
    // 如果 selectedRoles 为空但 value 有值，说明 API 还没加载完成
    // 创建临时的角色对象显示 ID
    return value.map(id => ({ id, name: id }))
  }, [selectedRoles, value])

  const handleSelect = (roleId: string) => {
    const newValues = value.includes(roleId)
      ? value.filter(v => v !== roleId)
      : [...value, roleId]
    onChange(newValues)
  }

  const handleRemove = (roleId: string) => {
    const newValues = value.filter(v => v !== roleId)
    onChange(newValues)
  }

  const getDisplayText = () => {
    if (value.length === 0) {
      return '选择上级角色...'
    }
    return `已选择 ${value.length} 个角色`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          disabled={disabled}
          className={cn(
            'w-full',
            'justify-start',
            'h-auto',
            'min-h-9',
          )}
        >
          <div className={cn('flex', 'gap-2', 'w-full')}>
            {value.length > 0
              ? (
                  <div className={cn('flex', 'flex-wrap', 'gap-1', 'flex-1')}>
                    {displayRoles.slice(0, 3).map((role: RoleOption) => (
                      <Badge
                        key={role.id}
                        variant="outline"
                        className={cn(
                          'inline-flex',
                          'items-center',
                          'gap-0',
                          'h-4',
                          'pr-0.5',
                          'rounded-sm',
                        )}
                      >
                        <span className={cn('text-[10px]', 'leading-4')}>
                          {role.name}
                        </span>
                        <span
                          className={cn(
                            'inline-flex',
                            'items-center',
                            'justify-center',
                            'p-0',
                            'w-4',
                            'h-full',
                            'text-muted-foreground',
                            'hover:text-destructive',
                            'rounded-sm',
                            'cursor-pointer',
                            'transition-colors',
                          )}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleRemove(role.id)
                          }}
                        >
                          <X className={cn('h-2!', 'w-2!')} />
                        </span>
                      </Badge>
                    ))}
                    {value.length > 3 && (
                      <span
                        className={cn(
                          'text-xs',
                          'text-muted-foreground',
                          'px-1',
                        )}
                      >
                        +
                        {value.length - 3}
                        {' '}
                        个
                      </span>
                    )}
                  </div>
                )
              : (
                  <span
                    className={cn(
                      'truncate',
                      'flex-1',
                      'text-start',
                      'text-xs',
                      'text-muted-foreground',
                    )}
                  >
                    {getDisplayText()}
                  </span>
                )}

            <ChevronsUpDown
              className={cn('h-4', 'w-4', 'shrink-0', 'opacity-50')}
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[300px]', 'p-0')} align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="搜索角色..."
            value={searchText}
            onValueChange={setSearchText}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? '加载中...' : '未找到角色'}
            </CommandEmpty>
            <CommandGroup>
              {availableRoles.map((role: RoleOption) => {
                const isSelected = value.includes(role.id)
                return (
                  <CommandItem
                    key={role.id}
                    value={role.id}
                    onSelect={() => handleSelect(role.id)}
                  >
                    <div className={cn('flex', 'flex-col', 'flex-1')}>
                      <span className={cn('text-sm', 'font-medium')}>
                        {role.name}
                      </span>
                      <span className={cn('text-xs', 'text-muted-foreground')}>
                        {role.id}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        'ml-auto',
                        'h-4',
                        'w-4',
                        isSelected ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
