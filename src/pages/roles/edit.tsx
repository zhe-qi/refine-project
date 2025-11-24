import { useForm } from '@refinedev/react-hook-form'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus } from '@/api/admin.d'
import { EditView } from '@/components/refine-ui/views/edit-view'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ParentRoleSelect } from './components/parent-role-select'

export function RoleEdit() {
  const navigate = useNavigate()
  const { id } = useParams()

  const {
    refineCore: { onFinish, query },
    ...form
  } = useForm({
    refineCoreProps: {
      resource: 'system/roles',
      action: 'edit',
      id,
    },
  })

  const roleData = query?.data?.data

  // 当数据加载完成后，设置 parentRoleIds 字段
  useEffect(() => {
    if (roleData?.parentRoles && !form.formState.isDirty) {
      form.setValue('parentRoleIds', roleData.parentRoles, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      })
    }
    if (roleData?.status) {
      form.setValue('status', roleData.status, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleData?.parentRoles, form])

  function onSubmit(values: Record<string, string>) {
    onFinish(values)
  }

  return (
    <EditView>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="id"
            rules={{ required: '角色 ID 必填' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>角色 ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder="输入角色 ID"
                    disabled
                  />
                </FormControl>
                <FormDescription>角色 ID 不可修改</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            rules={{ required: '角色名称必填' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>角色名称</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder="输入角色名称"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>描述</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    placeholder="输入角色描述（可选）"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentRoleIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>上级角色</FormLabel>
                <FormControl>
                  <ParentRoleSelect
                    value={field.value || []}
                    onChange={field.onChange}
                    excludeRoleId={roleData?.id as string}
                  />
                </FormControl>
                <FormDescription>
                  选择此角色的上级角色，子角色将继承上级角色的所有权限
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            rules={{ required: '状态必填' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>状态</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={String(field.value) || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus.ENABLED}>启用</SelectItem>
                    <SelectItem value={PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus.DISABLED}>禁用</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              {...form.saveButtonProps}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? '更新中...' : '更新'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              取消
            </Button>
          </div>
        </form>
      </Form>
    </EditView>
  )
}
