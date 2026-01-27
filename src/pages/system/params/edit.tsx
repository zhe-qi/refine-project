import { useForm } from '@refinedev/react-hook-form'
import { useNavigate, useParams } from 'react-router'

import { EditView } from '@/components/refine-ui/views/edit-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

// 状态枚举
const Status = {
  ENABLED: 'ENABLED',
  DISABLED: 'DISABLED',
} as const

// 值类型枚举
const ValueType = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  JSON: 'JSON',
} as const

interface ParamFormValues {
  key: string
  value: string
  valueType?: string
  name: string
  description?: string
  status?: string
}

export function ParamEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const {
    refineCore: { onFinish, query },
    ...form
  } = useForm<ParamFormValues>({
    refineCoreProps: {
      action: 'edit',
      id,
    },
  })

  const onSubmit = (values: any) => {
    onFinish(values)
  }

  const isLoading = query?.isLoading
  const selectedValueType = form.watch('valueType')

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
                name="key"
                rules={{
                  required: '参数键不能为空',
                  pattern: {
                    value: /^[a-z0-9_]+$/,
                    message: '只能包含小写字母、数字和下划线',
                  },
                  maxLength: {
                    value: 128,
                    message: '最多128个字符',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>参数键 *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="例如：sms_sign（小写字母、数字、下划线）"
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
                  required: '参数名称不能为空',
                  maxLength: {
                    value: 128,
                    message: '最多128个字符',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>参数名称 *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="例如：短信签名"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>值类型</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择值类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ValueType.STRING}>字符串</SelectItem>
                        <SelectItem value={ValueType.NUMBER}>数字</SelectItem>
                        <SelectItem value={ValueType.BOOLEAN}>布尔值</SelectItem>
                        <SelectItem value={ValueType.JSON}>JSON</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      指定参数值的类型，供前端解析使用
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                rules={{
                  required: '参数值不能为空',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>参数值 *</FormLabel>
                    <FormControl>
                      {selectedValueType === ValueType.JSON
                        ? (
                            <Textarea
                              {...field}
                              value={field.value || ''}
                              placeholder='例如：{"key": "value"}'
                              rows={5}
                              className="font-mono"
                            />
                          )
                        : selectedValueType === ValueType.BOOLEAN
                          ? (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="选择布尔值" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">true</SelectItem>
                                  <SelectItem value="false">false</SelectItem>
                                </SelectContent>
                              </Select>
                            )
                          : (
                              <Input
                                {...field}
                                value={field.value || ''}
                                type={selectedValueType === ValueType.NUMBER ? 'number' : 'text'}
                                placeholder={selectedValueType === ValueType.NUMBER ? '例如：100' : '例如：系统默认值'}
                              />
                            )}
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
                    <FormLabel>参数描述</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        placeholder="参数的详细说明"
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
                        <SelectItem value={Status.ENABLED}>启用</SelectItem>
                        <SelectItem value={Status.DISABLED}>禁用</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
