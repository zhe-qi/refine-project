'use client'

import type { CapWidgetRef } from '@/components/cap-widget'

import { useLogin, useRefineOptions } from '@refinedev/core'
import { useRef, useState } from 'react'
import { CapWidget } from '@/components/cap-widget'
import { InputPassword } from '@/components/refine-ui/form/input-password'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export function SignInForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const capWidgetRef = useRef<CapWidgetRef>(null)

  const { title } = useRefineOptions()

  const { mutate: login, isPending } = useLogin()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!captchaToken) {
      return
    }

    login(
      {
        username,
        password,
        captchaToken,
      },
      {
        onSuccess: () => {
          // 登录成功后重置验证码状态
          capWidgetRef.current?.reset()
          setCaptchaToken('')
        },
        onError: () => {
          // 登录失败后重置验证码状态
          capWidgetRef.current?.reset()
          setCaptchaToken('')
        },
      },
    )
  }

  const handleCaptchaSolve = (token: string) => {
    setCaptchaToken(token)
  }

  return (
    <div
      className={cn(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'px-6',
        'py-8',
        'min-h-svh',
      )}
    >
      <div className={cn('flex', 'items-center', 'justify-center')}>
        {title.icon && (
          <div
            className={cn('text-foreground', '[&>svg]:w-12', '[&>svg]:h-12')}
          >
            {title.icon}
          </div>
        )}
      </div>

      <Card className={cn('sm:w-[456px]', 'p-12', 'mt-6')}>
        <CardHeader className={cn('px-0')}>
          <CardTitle
            className={cn(
              'text-blue-600',
              'dark:text-blue-400',
              'text-3xl',
              'font-semibold',
            )}
          >
            登录
          </CardTitle>
          <CardDescription
            className={cn('text-muted-foreground', 'font-medium')}
          >
            欢迎回来，请输入您的账户信息
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className={cn('px-0')}>
          <form onSubmit={handleSignIn}>
            <div className={cn('flex', 'flex-col', 'gap-2')}>
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder=""
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div
              className={cn('relative', 'flex', 'flex-col', 'gap-2', 'mt-6')}
            >
              <Label htmlFor="password">密码</Label>
              <InputPassword
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={cn('mt-6')}>
              <CapWidget
                ref={capWidgetRef}
                onSolve={handleCaptchaSolve}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className={cn('w-full', 'mt-6')}
              disabled={!captchaToken || isPending}
            >
              {isPending ? '登录中...' : '登录'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

SignInForm.displayName = 'SignInForm'
