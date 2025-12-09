import Cap from '@cap.js/widget'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import './styles.css'

interface CapWidgetProps {
  apiEndpoint?: string
  onSolve: (token: string) => void
}

export interface CapWidgetRef {
  reset: () => void
}

type VerificationState = 'pending' | 'verifying' | 'success' | 'error'

// 星之卡比 SVG 组件
function KirbyComponent({ state }: { state: VerificationState }) {
  return (
    <div className="kirby-avatar">
      <svg className="kirby-svg" viewBox="0 0 200 200">
        <use href="#star" className="kirby-star-spit" />
        <defs>
          <path
            d="M167.58,120.58c0,18-6,30.75-62.29,29.58C49,149,43,138.58,43,120.58S70.89,85,105.29,85 S167.58,102.59,167.58,120.58z"
          />
          <path
            id="star"
            className="kirby-star"
            d="M119.43,124.74l4.63-5.32a4.08,4.08,0,0,0-2.39-6.7l-5.23-1a.9.9,0,0,1-.56-.39l-4.67-7.69a4.28,4.28,0,0,0-7.27,0l-4.68,7.69a.85.85,0,0,1-.56.39l-5.23,1a4.09,4.09,0,0,0-2.39,6.7l4.63,5.32a.77.77,0,0,1,.18.72l-1.51,6a4.19,4.19,0,0,0,5.82,4.73l7-3a.89.89,0,0,1,.68,0l7,3a4.19,4.19,0,0,0,5.82-4.73l-1.51-6A.82.82,0,0,1,119.43,124.74Z"
          />
        </defs>

        {/* 脚部 - 左 */}
        <motion.g
          id="legLeft"
          animate={
            state === 'pending'
              ? { y: [0, 2, 0] }
              : state === 'verifying'
                ? { y: [-5, 5] }
                : state === 'success'
                  ? { y: [-10, 0] }
                  : { y: 0 }
          }
          transition={{
            duration: state === 'pending' ? 3 : state === 'verifying' ? 0.6 : 0.5,
            ease: 'easeInOut',
            repeat: state === 'pending' || state === 'verifying' ? Infinity : 0,
            repeatType: 'reverse',
          }}
        >
          <ellipse className="kirby-foot" cx="90" cy="141.5" rx="23" ry="26" />
          <ellipse className="kirby-stroke" cx="85" cy="141.5" rx="23" ry="26" />
        </motion.g>

        {/* 脚部 - 右 */}
        <motion.g
          id="legRight"
          animate={
            state === 'pending'
              ? { y: [0, 2, 0] }
              : state === 'verifying'
                ? { y: [-5, 5], rotate: [0, -15, 0] }
                : state === 'success'
                  ? { y: [-10, 0] }
                  : { y: 0, rotate: 0 }
          }
          transition={{
            duration: state === 'pending' ? 3 : state === 'verifying' ? 0.8 : 0.5,
            ease: 'easeInOut',
            repeat: state === 'pending' || state === 'verifying' ? Infinity : 0,
            repeatType: 'reverse',
            delay: 0.2,
          }}
          style={{ transformOrigin: '138px 134px' }}
        >
          <ellipse className="kirby-foot" cx="138" cy="134.5" rx="23" ry="26" />
          <ellipse className="kirby-stroke" cx="138" cy="129.5" rx="23" ry="26" />
        </motion.g>

        {/* 左手臂 */}
        <motion.g
          id="armLeft"
          animate={
            state === 'pending'
              ? { rotate: [0, 5, 0] }
              : state === 'verifying'
                ? { rotate: [0, 80, 70], y: [0, -10, 50] }
                : state === 'success'
                  ? { rotate: 15, y: -5 }
                  : { rotate: 0, x: 0, y: 0 }
          }
          transition={{
            duration: state === 'pending' ? 4 : state === 'verifying' ? 2 : 0.6,
            ease: state === 'verifying' ? 'easeInOut' : 'easeOut',
            repeat: state === 'pending' ? Infinity : 0,
            repeatType: state === 'pending' ? 'reverse' : 'loop',
          }}
          style={{ transformOrigin: '51px 76px' }}
        >
          <circle className="kirby-body" cx="51.5" cy="76" r="20.5" />
          <circle className="kirby-stroke" cx="50.5" cy="82" r="20.5" />
        </motion.g>

        {/* 身体主体 */}
        <motion.g
          id="body"
          animate={
            state === 'pending'
              ? { scale: [1, 1.01, 1], y: [0, -1, 0] }
              : state === 'verifying'
                ? { scale: [1, 1.1, 1.05], y: [0, -2, 0] }
                : state === 'success'
                  ? { scale: [1.05, 1], y: [0, -5, 0] }
                  : { scale: 1, y: 0 }
          }
          transition={{
            duration: state === 'pending' ? 3 : state === 'verifying' ? 1.5 : 0.8,
            ease: state === 'verifying' ? 'anticipate' : 'easeInOut',
            repeat: state === 'pending' || state === 'verifying' ? Infinity : 0,
            repeatType: 'reverse',
          }}
          style={{ transformOrigin: 'center' }}
        >
          <path
            className="kirby-body"
            d="M159,95.5 C159,127.25637 133.25637,153 101.5,153 69.74363,153 44,127.25637 44,95.5 44,63.74363 69.74363,38 101.5,38 133.25637,38 159,63.74363 159,95.5 z"
          />
          <path
            className="kirby-stroke"
            d="M158,91.5 C158,123.25637 132.25637,149 100.5,149 68.74363,149 43,123.25637 43,91.5 43,59.74363 68.74363,34 100.5,34 132.25637,34 158,59.74363 158,91.5 z"
          />
        </motion.g>

        {/* 右手臂 */}
        <motion.g
          id="armRight"
          animate={
            state === 'pending'
              ? { rotate: [0, -5, 0] }
              : state === 'verifying'
                ? { rotate: [0, -15, -50], x: [0, 10, 0], y: [0, -5, 50] }
                : state === 'success'
                  ? { rotate: -15, y: -5 }
                  : { rotate: 0, x: 0, y: 0 }
          }
          transition={{
            duration: state === 'pending' ? 4 : state === 'verifying' ? 2 : 0.6,
            ease: state === 'verifying' ? 'easeInOut' : 'easeOut',
            repeat: state === 'pending' ? Infinity : 0,
            repeatType: state === 'pending' ? 'reverse' : 'loop',
            delay: state === 'pending' ? 0.1 : 0.3,
          }}
          style={{ transformOrigin: '150px 76px' }}
        >
          <path className="kirby-body" d="M141,58.73A20.5,20.5,0,1,1,154.68,94.5" />
          <path className="kirby-stroke" d="M136,58.73A20.5,20.5,0,1,1,149.68,94.5" />
        </motion.g>

        {/* 面部表情区域 */}
        <motion.g
          id="face"
          animate={
            state === 'verifying'
              ? { y: [-2, 2], rotate: [0, 5, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
            repeat: state === 'verifying' ? Infinity : 0,
            repeatType: 'reverse',
          }}
        >
          {/* 眼睛 - 普通状态 */}
          <AnimatePresence>
            {state !== 'success' && (
              <>
                <motion.path
                  className="kirby-eye"
                  d="M84,84.53c0,5.8-1.57,9.47-3.5,9.47S77,90.33,77,84.53,78.57,73,80.5,73,84,78.73,84,84.53Z"
                  animate={{
                    scaleY: state === 'verifying' ? [1, 0.2, 1] : 1,
                    y: state === 'verifying' ? [0, 20, 0] : 0,
                  }}
                  transition={{
                    duration: state === 'verifying' ? 0.5 : 0.3,
                    repeat: state === 'verifying' ? Infinity : 0,
                    repeatDelay: 2,
                    ease: 'easeInOut',
                  }}
                />
                <motion.path
                  className="kirby-eye"
                  d="M68,84.53c0,5.8-1.57,9.47-3.5,9.47S61,90.33,61,84.53,62.57,73,64.5,73,68,78.73,68,84.53Z"
                  animate={{
                    scaleY: state === 'verifying' ? [1, 0.2, 1] : 1,
                    y: state === 'verifying' ? [0, 20, 0] : 0,
                  }}
                  transition={{
                    duration: state === 'verifying' ? 0.5 : 0.3,
                    repeat: state === 'verifying' ? Infinity : 0,
                    repeatDelay: 2,
                    delay: 0.1,
                    ease: 'easeInOut',
                  }}
                />
              </>
            )}
          </AnimatePresence>

          {/* 眼睛 - 成功状态（闭眼微笑） */}
          <AnimatePresence>
            {state === 'success' && (
              <>
                <motion.path
                  className="kirby-stroke"
                  d="M80.69,85c.37-1.41,1.89-3.8,4-6.35a22.84,22.84,0,0,1,5.61-5.14"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <motion.path
                  className="kirby-stroke"
                  d="M55.05,73.61c1.33.61,3.42,2.52,5.56,5.07a23.08,23.08,0,0,1,4.09,6.42"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* 脸颊红晕 */}
          <motion.g
            animate={{
              opacity: state === 'verifying' ? [0.6, 1] : state === 'success' ? 0.8 : 0.6,
              y: state === 'verifying' ? [0, 40, 0] : 0,
            }}
            transition={{
              duration: state === 'verifying' ? 1.2 : 0.8,
              repeat: state === 'verifying' ? Infinity : 0,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          >
            <path
              className="kirby-blush kirby-stroke"
              d="M93,92.94A22.41,22.41,0,0,1,101.66,89l1.09,5.41s2.74-2.94,8.66-3.93"
            />
            <path
              className="kirby-blush kirby-blush-small kirby-stroke"
              d="M47,92.94A11,11,0,0,1,51.19,89l.52,5.41a8,8,0,0,1,4.19-3.93"
            />
          </motion.g>
        </motion.g>

        {/* 嘴巴区域 */}
        <AnimatePresence mode="wait">
          {/* 普通嘴巴 */}
          {state === 'pending' && (
            <motion.path
              className="kirby-stroke"
              d="M77,98c0,1.93-2.12,3.5-4.5,3.5S68,99.93,68,98"
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}

          {/* 张开的嘴巴 - 验证中 */}
          {state === 'verifying' && (
            <motion.g
              className="kirby-mouth-open"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 0.3, 1] }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.8, ease: 'anticipate' }}
              style={{ transformOrigin: 'center' }}
            >
              <motion.path
                className="kirby-stroke kirby-mouth-open-inner"
                d="M94,105.69c0,14.36-11,23.31-22,23.31s-18-9-18-23.31S61,77,72,77,94,91.33,94,105.69Z"
                animate={{
                  scaleY: [1, 1.1, 1],
                  scaleX: [1, 0.9, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              />
              <motion.path
                className="kirby-stroke kirby-mouth-open-tongue"
                d="M72,129a22,22,0,0,0,18.91-11.18C90,109.51,82.8,101.07,74,101.07c-9.39,0-17,9.6-17,18.41,0,.11,0,.21,0,.32A16.16,16.16,0,0,0,72,129Z"
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              />
            </motion.g>
          )}

          {/* 微笑嘴巴 - 成功状态 */}
          {state === 'success' && (
            <motion.path
              className="kirby-stroke"
              d="M65,98c2,3 6,3 8,3s6,0 8-3"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ strokeLinecap: 'round' }}
            />
          )}
        </AnimatePresence>

        {/* 验证成功时的星星效果 */}
        <AnimatePresence>
          {state === 'success' && (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <motion.use
                  key={`success-star-${i}`}
                  href="#star"
                  initial={{
                    scale: 0,
                    x: 100,
                    y: 95,
                    rotate: 0,
                    opacity: 0,
                  }}
                  animate={{
                    scale: [0, 0.4, 0.2],
                    x: 100 + Math.cos(i * Math.PI / 3) * 30,
                    y: 95 + Math.sin(i * Math.PI / 3) * 30,
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    ease: 'easeOut',
                    delay: 0.5 + i * 0.1,
                  }}
                  fill="var(--accent-color)"
                  stroke="var(--black)"
                  strokeWidth="1.5"
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </svg>
    </div>
  )
}

export function CapWidget({ ref, apiEndpoint, onSolve }: CapWidgetProps & { ref?: React.RefObject<CapWidgetRef | null> }) {
  const [state, setState] = useState<VerificationState>('pending')
  const [verificationText] = useState('点击验证身份') // 固定的验证文字
  const [isTextAnimating, setIsTextAnimating] = useState(false)
  const capInstanceRef = useRef<any>(null)

  // 添加状态锁和流程控制
  const isProcessingRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set())

  // 统一的定时器管理函数
  const safeSetTimeout = (callback: () => void, delay: number) => {
    const timerId = setTimeout(() => {
      timersRef.current.delete(timerId)
      if (!abortControllerRef.current?.signal.aborted) {
        callback()
      }
    }, delay)
    timersRef.current.add(timerId)
    return timerId
  }

  // 清理所有定时器
  const clearAllTimers = () => {
    timersRef.current.forEach(timerId => clearTimeout(timerId))
    timersRef.current.clear()
  }

  // 原子性状态更新函数
  const safeSetState = (newState: VerificationState) => {
    if (!abortControllerRef.current?.signal.aborted) {
      setState(newState)
    }
  }

  // Cap.js 隐身模式集成
  useEffect(() => {
    let cleanupFunction: (() => void) | null = null

    // 初始化 Cap.js
    const initializeCap = async () => {
      try {
        const endpoint = apiEndpoint || `${import.meta.env.VITE_APP_API_URL || ''}/api/admin/auth/`

        const cap = new Cap({
          'apiEndpoint': endpoint,
          'data-cap-worker-count': String(navigator.hardwareConcurrency || 8),
        })

        // 监听验证进度 - 基于 Cap.js 文档的进度事件处理
        const handleProgress = (_event: any) => {
          // Cap.js 的进度事件提供 event.detail.progress 百分比
          // 我们不再需要显示进度条，但可以用来判断验证进展
          // const _progressValue = Math.round(event.detail.progress || 0)
          // 可以在这里添加其他基于进度的逻辑
        }

        // eslint-disable-next-line react-web-api/no-leaked-event-listener
        cap.addEventListener('progress', handleProgress)
        capInstanceRef.current = cap

        // 清理函数：Cap 实例会在组件卸载时自动清理
        cleanupFunction = () => {
          capInstanceRef.current = null
        }
      }
      catch (error) {
        console.error('Failed to initialize Cap.js:', error)
      }
    }

    initializeCap()

    return () => {
      if (cleanupFunction) {
        cleanupFunction()
      }
    }
  }, [apiEndpoint])

  // 组件卸载时的清理
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
      clearAllTimers()
      isProcessingRef.current = false
    }
  }, [])

  // 处理验证点击
  const handleVerificationClick = async () => {
    // 防止重复点击和并发执行
    if (state !== 'pending' || isProcessingRef.current)
      return

    // 设置处理状态锁
    isProcessingRef.current = true

    // 创建新的 AbortController 用于流程控制
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    clearAllTimers()

    // 开始文字动画
    setIsTextAnimating(true)

    // 立即进入验证状态，让卡比张嘴
    setState('verifying')

    try {
      // 文字动画完成后停止动画状态
      safeSetTimeout(() => {
        if (!abortControllerRef.current?.signal.aborted) {
          setIsTextAnimating(false)
        }
      }, 2800)

      if (capInstanceRef.current) {
        // 使用 Cap.js 隐身模式进行验证
        const solution = await capInstanceRef.current.solve()

        // 检查是否已被中止
        if (abortControllerRef.current?.signal.aborted) {
          return
        }

        // 验证成功 - 原子性状态更新
        clearAllTimers() // 清理所有待执行的定时器
        setState('success')
        setIsTextAnimating(false)

        // 立即返回 token，让登录按钮可以使用
        onSolve(solution.token)
      }
      else {
        // 模拟 Cap.js 的工作量证明解决过程
        const simulateCapProgress = () => {
          let currentProgress = 0

          const updateProgress = () => {
            // 检查是否已被中止
            if (abortControllerRef.current?.signal.aborted) {
              return
            }

            const increment = Math.random() * 8 + 2
            currentProgress += increment

            if (currentProgress >= 100) {
              // 验证完成 - 原子性状态更新
              clearAllTimers()
              setState('success')
              setIsTextAnimating(false)

              // 立即返回 token，让登录按钮可以使用
              onSolve(`mock-token-${Date.now()}`)
            }
            else {
              const nextDelay = Math.random() * 300 + 100
              safeSetTimeout(updateProgress, nextDelay)
            }
          }

          updateProgress()
        }

        simulateCapProgress()
      }
    }
    catch (error) {
      console.error('Verification failed:', error)

      // 错误处理 - 原子性状态更新
      clearAllTimers()
      setState('error')
      setIsTextAnimating(false)

      // 3秒后重置状态
      safeSetTimeout(() => {
        safeSetState('pending')
        isProcessingRef.current = false
      }, 3000)
    }
    finally {
      // 如果不是正在验证状态，释放处理锁
      safeSetTimeout(() => {
        isProcessingRef.current = false
      }, 3000) // 给足够时间让状态转换完成
    }
  }

  // 实际执行重置的内部方法
  const performReset = () => {
    // 中止所有进行中的操作
    abortControllerRef.current?.abort()
    clearAllTimers()

    // 重置所有状态
    setState('pending')
    setIsTextAnimating(false)
    isProcessingRef.current = false

    // 重置 Cap.js 实例
    if (capInstanceRef.current && typeof capInstanceRef.current.reset === 'function') {
      capInstanceRef.current.reset()
    }
  }

  // 重置方法 - 彻底清理所有状态
  const reset = () => {
    // 如果正在验证中，延迟重置让动画完成
    if (state === 'verifying' || isTextAnimating) {
      // 标记需要重置，但不立即执行
      safeSetTimeout(() => {
        performReset()
      }, 1000) // 给动画一些时间完成
      return
    }

    performReset()
  }

  useImperativeHandle(ref, () => ({
    reset,
  }))

  return (
    <div className="kirby-captcha-container">
      <motion.div
        className={`kirby-captcha-widget ${state}`}
        onClick={handleVerificationClick}
        whileHover={state === 'pending' ? { scale: 1.01 } : {}}
        whileTap={state === 'pending' ? { scale: 0.99 } : {}}
        style={{
          cursor: state === 'pending' ? 'pointer' : 'default',
        }}
      >
        {/* 左侧：验证内容区域 */}
        <div className="kirby-content-area">
          <div className="kirby-verification-text">
            {(state === 'pending' || isTextAnimating) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="verification-message"
              >
                {/* 将文字拆分为单个字符以实现动画 */}
                {verificationText.split('').map((char, index) => (
                  <motion.span
                    key={`char-${char}-${Math.random()}`}
                    className="verification-text-char"
                    animate={isTextAnimating
                      ? {
                          x: 250, // 调整到卡比嘴巴位置
                          y: 0, // 保持水平飞行
                          scale: 0,
                          opacity: 0,
                        }
                      : {}}
                    transition={isTextAnimating
                      ? {
                          duration: 2, // 加快动画速度
                          delay: index * 0.05, // 减少字符间延迟
                          ease: 'easeInOut',
                        }
                      : {}}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.div>
            )}

            {state === 'verifying' && !isTextAnimating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="verification-message"
              >
                正在验证身份...
              </motion.div>
            )}

            {state === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="success-message"
              >
                <span className="success-icon">✓</span>
                验证成功
              </motion.div>
            )}

            {state === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="error-message"
              >
                验证失败，请重试
              </motion.div>
            )}
          </div>

          {/* 验证进度条已移除 */}
        </div>

        {/* 右侧：星之卡比头像 */}
        <KirbyComponent state={state} />
      </motion.div>
    </div>
  )
}

CapWidget.displayName = 'CapWidget'
