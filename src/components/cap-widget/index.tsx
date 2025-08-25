import { theme } from 'antd'
import React, { useEffect, useImperativeHandle, useRef } from 'react'
import './styles.css'

interface CapWidgetProps {
  apiEndpoint?: string
  onSolve: (token: string) => void
}

export interface CapWidgetRef {
  reset: () => void
}

export function CapWidget({ ref, apiEndpoint, onSolve }: CapWidgetProps & { ref?: React.RefObject<CapWidgetRef | null> }) {
  const widgetContainerRef = useRef<HTMLDivElement>(null)
  const capWidgetRef = useRef<any>(null)
  const { token } = theme.useToken()

  useEffect(() => {
    // 动态创建 cap-widget Web Component
    if (widgetContainerRef.current) {
      const container = widgetContainerRef.current // 复制引用避免 ESLint 警告
      const capWidget = document.createElement('cap-widget')

      // 设置 API 端点，默认使用环境变量
      const endpoint = apiEndpoint || `${import.meta.env.VITE_APP_API_URL || ''}/api/admin/auth/`
      capWidget.dataset.capApiEndpoint = endpoint

      // 添加 i18n 属性
      capWidget.dataset.capI18nVerifyingLabel = '验证中...'
      capWidget.dataset.capI18nInitialState = '点击验证'
      capWidget.dataset.capI18nSolvedLabel = '验证通过'
      capWidget.dataset.capI18nErrorLabel = '验证失败，请重试'

      // 动态设置 CSS 变量，使用 Ant Design token
      capWidget.style.setProperty('--cap-background', token.colorFillQuaternary)
      capWidget.style.setProperty('--cap-border-color', token.colorBorder)
      capWidget.style.setProperty('--cap-color', token.colorText)
      capWidget.style.setProperty('--cap-primary-color', token.colorPrimary)

      const handleSolve = (event: CustomEvent) => {
        const captchaToken = event.detail.token
        console.warn('验证成功，收到 captcha token:', captchaToken)

        // 立即尝试访问 Shadow DOM（不延迟）
        const attemptStyleApplication = (attempt: number = 1) => {
          console.warn(`=== 第 ${attempt} 次尝试应用样式 ===`)

          const shadowRoot = (capWidget as any).shadowRoot
          console.warn('shadowRoot:', shadowRoot)

          if (shadowRoot) {
            console.warn(`shadowRoot innerHTML (尝试 ${attempt}):`, shadowRoot.innerHTML)
            const shadowCaptcha = shadowRoot.querySelector('.captcha') as HTMLElement
            console.warn(`shadow captcha (尝试 ${attempt}):`, shadowCaptcha)

            if (shadowCaptcha) {
              console.warn('找到 Shadow DOM 中的 .captcha 元素！')

              // 既然直接修改 Shadow DOM 样式不生效，我们在外层添加成功提示覆盖层
              const container = capWidget.parentElement
              if (container) {
                // 移除之前可能存在的成功覆盖层
                const existingOverlay = container.querySelector('.captcha-success-overlay')
                if (existingOverlay) {
                  existingOverlay.remove()
                }

                // 创建成功状态覆盖层
                const successOverlay = document.createElement('div')
                successOverlay.className = 'captcha-success-overlay'
                successOverlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: ${token.colorSuccess};
                    border: 1px solid ${token.colorSuccess};
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    color: white;
                    font-weight: 500;
                    font-size: 14px;
                    z-index: 10;
                    pointer-events: none;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                  `

                // 创建复选框图标
                const checkboxIcon = document.createElement('div')
                checkboxIcon.style.cssText = `
                    width: 20px;
                    height: 20px;
                    background-color: white;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    flex-shrink: 0;
                  `
                checkboxIcon.innerHTML = `<span style="color: ${token.colorSuccess}; font-weight: bold; font-size: 14px;">✓</span>`

                // 创建文字
                const text = document.createElement('span')
                text.textContent = '验证通过'

                successOverlay.appendChild(checkboxIcon)
                successOverlay.appendChild(text)

                // 设置容器为相对定位
                container.style.position = 'relative'
                container.appendChild(successOverlay)

                console.warn('成功创建验证通过覆盖层！')
              }
              else {
                console.warn('找不到容器元素')
              }

              console.warn('样式应用完成！')
              return true // 成功
            }
            else if (attempt < 10) {
              // 如果找不到元素，递增延迟后再试
              console.warn(`第 ${attempt} 次尝试失败，${100 * attempt}ms 后重试...`)
              // eslint-disable-next-line react-web-api/no-leaked-timeout
              setTimeout(() => attemptStyleApplication(attempt + 1), 100 * attempt)
              return false
            }
            else {
              console.warn('尝试 10 次后仍然找不到 .captcha 元素')

              // 最后一招：监听 Shadow Root 的变化
              const shadowObserver = new MutationObserver((mutations) => {
                console.warn('Shadow DOM 发生变化:', mutations)
                const shadowCaptcha = shadowRoot.querySelector('.captcha') as HTMLElement
                if (shadowCaptcha) {
                  console.warn('通过 MutationObserver 找到了 .captcha 元素！')
                  shadowObserver.disconnect()
                  attemptStyleApplication(11) // 最后一次尝试
                }
              })

              shadowObserver.observe(shadowRoot, { childList: true, subtree: true })

              // 10 秒后停止监听
              // eslint-disable-next-line react-web-api/no-leaked-timeout
              setTimeout(() => {
                shadowObserver.disconnect()
                console.warn('停止监听 Shadow DOM 变化')
              }, 10000)
            }
          }
          return false
        }

        // 立即尝试第一次
        attemptStyleApplication()

        onSolve(captchaToken)
      }

      // 手动处理悬停事件和验证成功状态
      const handleMouseEnter = () => {
        const captcha = capWidget.querySelector('.captcha') as HTMLElement
        if (captcha) {
          captcha.style.setProperty('background', token.colorPrimary, 'important')
          captcha.style.setProperty('border-color', token.colorPrimary, 'important')
          captcha.style.setProperty('color', 'white', 'important')
        }
      }

      const handleMouseLeave = () => {
        const captcha = capWidget.querySelector('.captcha') as HTMLElement
        if (captcha && !captcha.classList.contains('solved')) {
          captcha.style.removeProperty('background')
          captcha.style.removeProperty('border-color')
          captcha.style.removeProperty('color')
        }
      }

      let stateObserver: MutationObserver | null = null

      // 监听 CAP widget 渲染完成后添加事件
      const observer = new MutationObserver(() => {
        const captcha = capWidget.querySelector('.captcha')
        if (captcha) {
          captcha.addEventListener('mouseenter', handleMouseEnter)
          captcha.addEventListener('mouseleave', handleMouseLeave)

          // 监听验证成功状态变化 - 监听 data-state 属性
          stateObserver = new MutationObserver((mutations) => {
            console.warn('Captcha state changed:', mutations)
            const dataState = captcha.getAttribute('data-state')
            console.warn('Current data-state:', dataState)

            // 打印 DOM 结构进行调试
            console.warn('=== DOM 调试信息 ===')
            console.warn('capWidget:', capWidget)
            console.warn('captcha element:', captcha)
            console.warn('captcha innerHTML:', captcha.innerHTML)
            console.warn('captcha outerHTML:', captcha.outerHTML)

            // 检查 Shadow Root
            const shadowRoot = (capWidget as any).shadowRoot
            console.warn('shadowRoot:', shadowRoot)
            console.warn('shadowRoot mode:', shadowRoot?.mode)

            if (shadowRoot) {
              console.warn('shadowRoot innerHTML:', shadowRoot.innerHTML)
              const shadowCaptcha = shadowRoot.querySelector('.captcha')
              console.warn('shadow captcha:', shadowCaptcha)
              if (shadowCaptcha) {
                console.warn('shadow captcha data-state:', shadowCaptcha.getAttribute('data-state'))
                const shadowCheckbox = shadowCaptcha.querySelector('.checkbox')
                console.warn('shadow checkbox:', shadowCheckbox)
              }
            }

            console.warn('=== 查找复选框 ===')
            const checkbox = captcha.querySelector('.checkbox')
            console.warn('Light DOM checkbox:', checkbox)
            if (shadowRoot) {
              const shadowCheckbox = shadowRoot.querySelector('.checkbox')
              console.warn('Shadow DOM checkbox:', shadowCheckbox)
            }

            if (dataState === 'done') {
              console.warn('检测到验证完成状态，应用自定义样式')

              // 方法1：直接设置 cap-widget 元素的 CSS 变量
              capWidget.style.setProperty('--cap-background', token.colorSuccess)
              capWidget.style.setProperty('--cap-border-color', token.colorSuccess)
              capWidget.style.setProperty('--cap-color', 'white')

              // 方法2：尝试修改 Shadow DOM 内的样式
              const captchaElement = captcha as HTMLElement
              captchaElement.style.setProperty('background-color', token.colorSuccess, 'important')
              captchaElement.style.setProperty('border-color', token.colorSuccess, 'important')
              captchaElement.style.setProperty('color', 'white', 'important')

              // 方法3：如果可以访问 Shadow Root，直接操作 Shadow DOM
              if (shadowRoot) {
                console.warn('找到 Shadow Root，尝试操作 Shadow DOM')
                const shadowCaptcha = shadowRoot.querySelector('.captcha') as HTMLElement
                const shadowCheckbox = shadowRoot.querySelector('.checkbox') as HTMLElement

                if (shadowCaptcha) {
                  shadowCaptcha.style.setProperty('background-color', token.colorSuccess, 'important')
                  shadowCaptcha.style.setProperty('border-color', token.colorSuccess, 'important')
                  shadowCaptcha.style.setProperty('color', 'white', 'important')
                }

                if (shadowCheckbox) {
                  console.warn('设置 Shadow DOM 复选框样式')
                  shadowCheckbox.style.setProperty('background-color', token.colorSuccess, 'important')
                  shadowCheckbox.style.setProperty('border-color', token.colorSuccess, 'important')
                  shadowCheckbox.innerHTML = `<span style="color: white; font-weight: bold; font-size: 12px;">✓</span>`
                }
              }
              else {
                console.warn('无法访问 Shadow Root')
              }
            }
            else if (dataState === 'verifying') {
              console.warn('验证中状态')
            }
            else if (dataState === 'error') {
              console.warn('验证失败状态')
            }
          })

          stateObserver.observe(captcha, { attributes: true, attributeFilter: ['data-state'] })
          observer.disconnect()
        }
      })

      observer.observe(capWidget, { childList: true, subtree: true })
      // eslint-disable-next-line react-web-api/no-leaked-event-listener
      capWidget.addEventListener('solve', handleSolve as EventListener)
      capWidgetRef.current = capWidget
      container.appendChild(capWidget)

      return () => {
        observer.disconnect()
        if (stateObserver) {
          stateObserver.disconnect()
        }
        const captcha = capWidget.querySelector('.captcha')
        if (captcha) {
          captcha.removeEventListener('mouseenter', handleMouseEnter)
          captcha.removeEventListener('mouseleave', handleMouseLeave)
        }
        capWidget.removeEventListener('solve', handleSolve as EventListener)
        if (container?.contains(capWidget)) {
          container.removeChild(capWidget)
        }
      }
    }
  }, [apiEndpoint, onSolve, token])

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (capWidgetRef.current && typeof capWidgetRef.current.reset === 'function') {
        capWidgetRef.current.reset()
      }
    },
  }))

  return (
    <div ref={widgetContainerRef} className="cap-widget-container">
      {/* cap-widget Web Component 将动态插入到这里 */}
    </div>
  )
}

CapWidget.displayName = 'CapWidget'
