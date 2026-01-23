import { useForm } from '@refinedev/react-hook-form'
import { useFieldArray } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { Plus, Trash2 } from 'lucide-react'

import { PathsApiAdminSystemDictGetParametersQueryStatus } from '@/api/admin.d'
import { EditView } from '@/components/refine-ui/views/edit-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
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

interface DictItem {
  label: string
  value: string
  sort: number
  disabled?: boolean
  color?: string
}

interface DictFormValues {
  code: string
  name: string
  description?: string
  items: DictItem[]
  status?: string
}

export function DictEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    refineCore: { onFinish, query },
    ...form
  } = useForm<DictFormValues>({
    refineCoreProps: {
      action: 'edit',
      id,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const onSubmit = (values: any) => {
    onFinish(values)
  }

  const handleAddItem = () => {
    const maxSort = fields.reduce((max, item) => Math.max(max, (item as unknown as DictItem).sort || 0), 0)
    append({
      label: '',
      value: '',
      sort: maxSort + 1,
      disabled: false,
      color: '',
    })
  }

  const isLoading = query?.isLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  return (
    <EditView>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基础信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                rules={{
                  required: '字典编码不能为空',
                  pattern: {
                    value: /^[a-z0-9_]+$/,
                    message: '只能包含小写字母、数字和下划线',
                  },
                  maxLength: {
                    value: 64,
                    message: '最多64个字符',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>字典编码 *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="例如：user_status（小写字母、数字、下划线）"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: '字典名称不能为空',
                  maxLength: {
                    value: 128,
                    message: '最多128个字符',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>字典名称 *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="例如：用户状态"
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
                    <FormLabel>字典描述</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        placeholder="字典的详细说明"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>状态</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PathsApiAdminSystemDictGetParametersQueryStatus.ENABLED}>
                          启用
                        </SelectItem>
                        <SelectItem value={PathsApiAdminSystemDictGetParametersQueryStatus.DISABLED}>
                          禁用
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>字典项</CardTitle>
                <Button type="button" size="sm" variant="outline" onClick={handleAddItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加字典项
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  暂无字典项，点击上方按钮添加
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-4 items-start border p-4 rounded-lg"
                    >
                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name={`items.${index}.label`}
                          rules={{
                            required: '显示文本不能为空',
                            maxLength: {
                              value: 64,
                              message: '最多64个字符',
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>显示文本 *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value || ''}
                                  placeholder="如：启用"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name={`items.${index}.value`}
                          rules={{
                            required: '字典值不能为空',
                            maxLength: {
                              value: 64,
                              message: '最多64个字符',
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>字典值 *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value || ''}
                                  placeholder="如：ENABLED"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.sort`}
                          rules={{
                            min: {
                              value: 0,
                              message: '不能为负数',
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>排序</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  value={field.value}
                                  onChange={e => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.color`}
                          rules={{
                            maxLength: {
                              value: 32,
                              message: '最多32个字符',
                            },
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>颜色</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value || ''}
                                  placeholder="#1890ff"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-1 flex flex-col">
                        <FormField
                          control={form.control}
                          name={`items.${index}.disabled`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>禁用</FormLabel>
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-1 flex flex-col">
                        <FormLabel>&nbsp;</FormLabel>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              type="submit"
              {...form.saveButtonProps}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? '保存中...' : '保存'}
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
