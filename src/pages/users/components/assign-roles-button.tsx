import { useCan, useResourceParams } from '@refinedev/core'
import { UserCog } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'

interface AssignRolesButtonProps {
  userId: string
  currentRoles?: { id: string, name: string }[]
}

export function AssignRolesButton({
  userId,
}: AssignRolesButtonProps) {
  const navigate = useNavigate()

  // 使用 useResourceParams 获取完整的 resource 对象
  const { resource } = useResourceParams()

  const { data } = useCan({
    resource: 'system/users',
    action: '分配角色',
    params: {
      id: userId,
      resource, // 传递完整的 resource 对象,这样 accessControlProvider 才能读取 meta.customActions
    },
  })

  // 根据权限决定是否显示按钮
  if (!data?.can) {
    return null
  }

  const handleClick = () => {
    navigate(`/system/users/assign-roles/${userId}`)
  }

  return (
    <Button size="sm" onClick={handleClick}>
      <div className="flex items-center gap-2 font-semibold">
        <UserCog className="h-4 w-4" />
        <span>分配角色</span>
      </div>
    </Button>
  )
}
