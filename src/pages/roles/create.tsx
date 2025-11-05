import { useForm } from '@refinedev/react-hook-form'
import { useNavigate } from 'react-router'

import { PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus } from '@/api/admin.d'
import { CreateView } from '@/components/refine-ui/views/create-view'
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

export function RoleCreate() {
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
    <CreateView>
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
                    placeholder="输入角色 ID（如：admin、editor）"
                  />
                </FormControl>
                <FormDescription>
                  角色的唯一标识符，只能包含字母、数字和下划线
                </FormDescription>
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
            name="status"
            rules={{ required: '状态必填' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>状态</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={PathsApiAdminSystemRolesGetResponses200ContentApplicationJsonDataStatus.ENABLED}>
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
              {form.formState.isSubmitting ? '创建中...' : '创建'}
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
    </CreateView>
  )
}

