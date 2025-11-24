'use client'

import type { TreeMenuItem } from '@refinedev/core'
import {
  CanAccess,
  useLink,
  useMenu,
  useRefineOptions,
} from '@refinedev/core'
import { ChevronRight, ListIcon } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent as ShadcnSidebarContent,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarRail as ShadcnSidebarRail,
  SidebarTrigger as ShadcnSidebarTrigger,
  useSidebar as useShadcnSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { accessControlProvider } from '@/providers/access-control'

export function Sidebar() {
  const { open } = useShadcnSidebar()
  const { menuItems, selectedKey } = useMenu()

  return (
    <ShadcnSidebar collapsible="icon" className={cn('border-none')}>
      <ShadcnSidebarRail />
      <SidebarHeader />
      <ShadcnSidebarContent
        className={cn(
          'transition-discrete',
          'duration-200',
          'flex',
          'flex-col',
          'gap-2',
          'pt-2',
          'pb-2',
          'border-r',
          'border-border',
          {
            'px-3': open,
            'px-1': !open,
          },
        )}
      >
        {menuItems.map((item: TreeMenuItem) => {
          // 如果菜单项没有路由（是父级分组），需要检查子菜单权限
          if (!item.route && item.children && item.children.length > 0) {
            return (
              <ProtectedParentMenuItem
                key={item.key || item.name}
                item={item}
                selectedKey={selectedKey}
              />
            )
          }

          // 有路由的菜单项需要权限检查
          return (
            <CanAccess
              key={item.key || item.name}
              resource={item.name}
              action="list"
              fallback={null}
            >
              <SidebarItem
                item={item}
                selectedKey={selectedKey}
              />
            </CanAccess>
          )
        })}
      </ShadcnSidebarContent>
    </ShadcnSidebar>
  )
}

interface MenuItemProps {
  item: TreeMenuItem
  selectedKey?: string
}

function SidebarItem({ item, selectedKey }: MenuItemProps) {
  const { open } = useShadcnSidebar()

  if (item.meta?.group) {
    return <SidebarItemGroup item={item} selectedKey={selectedKey} />
  }

  if (item.children && item.children.length > 0) {
    if (open) {
      return <SidebarItemCollapsible item={item} selectedKey={selectedKey} />
    }
    return <SidebarItemDropdown item={item} selectedKey={selectedKey} />
  }

  return <SidebarItemLink item={item} selectedKey={selectedKey} />
}

function SidebarItemGroup({ item, selectedKey }: MenuItemProps) {
  const { children } = item
  const { open } = useShadcnSidebar()

  return (
    <div className={cn('border-t', 'border-sidebar-border', 'pt-4')}>
      <span
        className={cn(
          'ml-3',
          'block',
          'text-xs',
          'font-semibold',
          'uppercase',
          'text-muted-foreground',
          'transition-all',
          'duration-200',
          {
            'h-8': open,
            'h-0': !open,
            'opacity-0': !open,
            'opacity-100': open,
            'pointer-events-none': !open,
            'pointer-events-auto': open,
          },
        )}
      >
        {getDisplayName(item)}
      </span>
      {children && children.length > 0 && (
        <div className={cn('flex', 'flex-col')}>
          {children.map((child: TreeMenuItem) => (
            <CanAccess
              key={child.key || child.name}
              resource={child.name}
              action="list"
              fallback={null}
            >
              <SidebarItem
                item={child}
                selectedKey={selectedKey}
              />
            </CanAccess>
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarItemCollapsible({ item, selectedKey }: MenuItemProps) {
  const { name, children } = item

  const chevronIcon = (
    <ChevronRight
      className={cn(
        'h-4',
        'w-4',
        'shrink-0',
        'text-muted-foreground',
        'transition-transform',
        'duration-200',
        'group-data-[state=open]:rotate-90',
      )}
    />
  )

  return (
    <Collapsible key={`collapsible-${name}`} className={cn('w-full', 'group')}>
      <CollapsibleTrigger asChild>
        <SidebarButton item={item} rightIcon={chevronIcon} />
      </CollapsibleTrigger>
      <CollapsibleContent className={cn('ml-6', 'flex', 'flex-col', 'gap-2')}>
        {children?.map((child: TreeMenuItem) => (
          <CanAccess
            key={child.key || child.name}
            resource={child.name}
            action="list"
            fallback={null}
          >
            <SidebarItem
              item={child}
              selectedKey={selectedKey}
            />
          </CanAccess>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

function SidebarItemDropdown({ item, selectedKey }: MenuItemProps) {
  const { children } = item
  const Link = useLink()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarButton item={item} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        {children?.map((child: TreeMenuItem) => {
          const { key: childKey } = child
          const isSelected = childKey === selectedKey

          return (
            <CanAccess
              key={childKey || child.name}
              resource={child.name}
              action="list"
              fallback={null}
            >
              <DropdownMenuItem asChild>
                <Link
                  to={child.route || ''}
                  className={cn('flex w-full items-center gap-2', {
                    'bg-accent text-accent-foreground': isSelected,
                  })}
                >
                  <ItemIcon
                    icon={child.meta?.icon ?? child.icon}
                    isSelected={isSelected}
                  />
                  <span>{getDisplayName(child)}</span>
                </Link>
              </DropdownMenuItem>
            </CanAccess>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SidebarItemLink({ item, selectedKey }: MenuItemProps) {
  const isSelected = item.key === selectedKey

  return <SidebarButton item={item} isSelected={isSelected} asLink={true} />
}

function SidebarHeader() {
  const { title } = useRefineOptions()
  const { open, isMobile } = useShadcnSidebar()

  return (
    <ShadcnSidebarHeader
      className={cn(
        'p-0',
        'h-16',
        'border-b',
        'border-border',
        'flex-row',
        'items-center',
        'justify-between',
        'overflow-hidden',
      )}
    >
      <div
        className={cn(
          'whitespace-nowrap',
          'flex',
          'flex-row',
          'h-full',
          'items-center',
          'justify-start',
          'gap-2',
          'transition-discrete',
          'duration-200',
          {
            'pl-3': !open,
            'pl-5': open,
          },
        )}
      >
        <div>{title.icon}</div>
        <h2
          className={cn(
            'text-sm',
            'font-bold',
            'transition-opacity',
            'duration-200',
            {
              'opacity-0': !open,
              'opacity-100': open,
            },
          )}
        >
          {title.text}
        </h2>
      </div>

      <ShadcnSidebarTrigger
        className={cn('text-muted-foreground', 'mr-1.5', {
          'opacity-0': !open,
          'opacity-100': open || isMobile,
          'pointer-events-auto': open || isMobile,
          'pointer-events-none': !open && !isMobile,
        })}
      />
    </ShadcnSidebarHeader>
  )
}

function getDisplayName(item: TreeMenuItem) {
  return item.meta?.label ?? item.label ?? item.name
}

interface IconProps {
  icon: React.ReactNode
  isSelected?: boolean
}

function ItemIcon({ icon, isSelected }: IconProps) {
  return (
    <div
      className={cn('w-4', {
        'text-muted-foreground': !isSelected,
        'text-sidebar-primary-foreground': isSelected,
      })}
    >
      {icon ?? <ListIcon />}
    </div>
  )
}

type SidebarButtonProps = React.ComponentProps<typeof Button> & {
  item: TreeMenuItem
  isSelected?: boolean
  rightIcon?: React.ReactNode
  asLink?: boolean
  onClick?: () => void
}

function SidebarButton({
  item,
  isSelected = false,
  rightIcon,
  asLink = false,
  className,
  onClick,
  ...props
}: SidebarButtonProps) {
  const Link = useLink()

  const buttonContent = (
    <>
      <ItemIcon icon={item.meta?.icon ?? item.icon} isSelected={isSelected} />
      <span
        className={cn('tracking-[-0.00875rem]', {
          'flex-1': rightIcon,
          'text-left': rightIcon,
          'line-clamp-1': !rightIcon,
          'truncate': !rightIcon,
          'font-normal': !isSelected,
          'font-semibold': isSelected,
          'text-sidebar-primary-foreground': isSelected,
          'text-foreground': !isSelected,
        })}
      >
        {getDisplayName(item)}
      </span>
      {rightIcon}
    </>
  )

  return (
    <Button
      asChild={!!(asLink && item.route)}
      variant="ghost"
      size="lg"
      className={cn(
        'flex w-full items-center justify-start gap-2 py-2 !px-3 text-sm',
        {
          'bg-sidebar-primary': isSelected,
          'hover:!bg-sidebar-primary/90': isSelected,
          'text-sidebar-primary-foreground': isSelected,
          'hover:text-sidebar-primary-foreground': isSelected,
        },
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {asLink && item.route
        ? (
            <Link to={item.route} className={cn('flex w-full items-center gap-2')}>
              {buttonContent}
            </Link>
          )
        : (
            buttonContent
          )}
    </Button>
  )
}

Sidebar.displayName = 'Sidebar'

// 用于父级菜单项的权限保护组件
// 如果所有子菜单都没权限，则隐藏父菜单
function ProtectedParentMenuItem({ item, selectedKey }: MenuItemProps) {
  const { children } = item
  // 初始状态设为 true，避免在权限检查期间菜单消失
  // 只有在明确确认无权限时才隐藏菜单
  const [hasVisibleChildren, setHasVisibleChildren] = React.useState<boolean | null>(true)

  React.useEffect(() => {
    if (!children || children.length === 0) {
      setHasVisibleChildren(false)
      return
    }

    // 检查所有子菜单的权限
    Promise.all(
      children.map(child =>
        accessControlProvider.can({
          resource: child.name,
          action: 'list',
        }),
      ),
    ).then((results) => {
      // 如果至少有一个子菜单有权限，显示父菜单
      const hasAny = results.some(result => result?.can === true)
      setHasVisibleChildren(hasAny)
    }).catch((error) => {
      // 权限检查失败时，保持显示状态
      // 这避免了因为权限服务暂时不可用导致的菜单消失
      console.warn('权限检查失败，保持菜单显示状态:', error)
      // 不调用 setHasVisibleChildren(false)，保持当前状态
    })
  }, [children])

  // 初始加载或权限检查中时，显示菜单（避免闪烁）
  if (hasVisibleChildren === null || hasVisibleChildren === true) {
    return <SidebarItem item={item} selectedKey={selectedKey} />
  }

  // 明确确认所有子菜单都没权限时，不显示父菜单
  if (!hasVisibleChildren) {
    return null
  }

  // 不应该到达这里，但以防万一
  return <SidebarItem item={item} selectedKey={selectedKey} />
}
