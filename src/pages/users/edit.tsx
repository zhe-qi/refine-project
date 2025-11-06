import { useForm } from '@refinedev/react-hook-form'
import { useNavigate } from 'react-router'

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
import { ImageUpload } from '@/components/upload/image-upload'

export function UserEdit() {
  const navigate = useNavigate()

  const {
    refineCore: { onFinish },
    ...form
  } = useForm({
    refineCoreProps: {},
  })

  function onSubmit(values: Record<string, string>) {
    onFinish(values)
  }

  return (
    <EditView>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            rules={{ required: '用户名必填' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>用户名</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder="输入用户名"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    value={field.value || ''}
                    placeholder="留空则不修改密码"
                  />
                </FormControl>
                <FormDescription>留空则不修改密码</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nickName"
            rules={{ required: '昵称必填' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>昵称</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value || ''}
                    placeholder="输入昵称"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>头像</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    limit={1}
                  />
                </FormControl>
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
