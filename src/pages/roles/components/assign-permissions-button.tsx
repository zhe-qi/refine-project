import { useCan, useResourceParams } from '@refinedev/core'
import { ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'

interface AssignPermissionsButtonProps {
  roleId: string
  roleName?: string
}

export function AssignPermissionsButton({
  roleId,
}: AssignPermissionsButtonProps) {
  const navigate = useNavigate()

  // 使用 useResourceParams 获取完整的 resource 对象
  const { resource } = useResourceParams()

  const { data } = useCan({
    resource: 'system/roles',
    action: '分配权限',
    params: {
      id: roleId,
      resource, // 传递完整的 resource 对象,这样 accessControlProvider 才能读取 meta.customActions
    },
  })

  // 根据权限决定是否显示按钮
  if (!data?.can) {
    return null
  }

  const handleClick = () => {
    navigate(`/system/roles/assign-permissions/${roleId}`)
  }

  return (
    <Button size="sm" onClick={handleClick}>
      <div className="flex items-center gap-2 font-semibold">
        <ShieldCheck className="h-4 w-4" />
        <span>分配权限</span>
      </div>
    </Button>
  )
}
