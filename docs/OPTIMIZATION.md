# 小鹤双拼练习器优化计划

> **最后更新**: 2026-01-11
> **完成进度**: 11/11 (100%) ✅

## 项目概述

**项目名称**: 小鹤双拼练习器 (xiaohe-shuangpin-trainer)
**技术栈**: Next.js 14 + TypeScript + Tailwind CSS + React 18
**部署**: Vercel
**仓库**: https://github.com/aliom-v/xiaohe-shuangpin-trainer

---

## 优化目标

1. **减少代码重复** - 提取公共逻辑，提高可维护性 ✅
2. **提升性能** - 减少不必要的计算和渲染 ✅
3. **增强 SEO** - 改善搜索引擎可见性 ✅
4. **改善可访问性** - 支持屏幕阅读器等辅助技术 ✅
5. **加强类型安全** - 消除 TypeScript any 类型 ✅

---

## 任务清单

### 第一阶段：代码重构 ✅

#### 1.1 抽取公共 Theme Hook ✅
**状态**: 已完成
**优先级**: 高
**影响文件**:
- `src/hooks/useTheme.ts` (新建)
- `src/components/Trainer.tsx`
- `src/components/Keyboard.tsx`
- `src/components/Stats.tsx`
- `src/components/Tutorial.tsx`
- `src/components/PracticeMode.tsx`
- `src/components/CustomTextModal.tsx`
- `src/components/ShuangpinLookup.tsx`

**实现方案**:
```typescript
// src/hooks/useTheme.ts
export function useTheme(darkMode: boolean) {
  return darkMode ? {
    bg: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-white',
    textMuted: 'text-gray-300',
    border: 'border-gray-700',
    input: 'bg-gray-700 border-gray-600',
    btn: 'bg-gray-700 hover:bg-gray-600',
    // ... 更多属性
  } : {
    // 亮色模式样式
  }
}
```

**成果**: 减少 ~150 行重复代码

#### 1.2 统一 parsePinyin 函数 ✅
**状态**: 已完成
**优先级**: 中
**影响文件**:
- `src/lib/xiaohe.ts` (导出 `parsePinyinParts`)
- `src/components/ShuangpinLookup.tsx` (删除本地重复函数)

#### 1.3 统一 calculateStreak 函数 ✅
**状态**: 已完成
**优先级**: 低
**影响文件**:
- `src/lib/learning.ts` (导出 `getStreak`)
- `src/components/Stats.tsx` (删除本地重复函数)

---

### 第二阶段：性能优化 ✅

#### 2.1 优化 Trainer 组件状态管理 ✅
**状态**: 已完成
**优先级**: 中
**影响文件**:
- `src/hooks/useTrainerState.ts` (新建)
- `src/hooks/useTrainerDerived.ts` (新建)
- `src/components/Trainer.tsx`

**实现方案**:
```typescript
// src/hooks/useTrainerState.ts
import { useCallback, useReducer } from 'react'

export interface TrainerState {
  inputText: string
  queue: CharInfo[]
  currentIndex: number
  // ... 20+ 状态统一管理
}

type TrainerAction =
  | { type: 'patch'; payload: Partial<TrainerState> }
  | { type: 'updateQueue'; updater: (prev: CharInfo[]) => CharInfo[] }
  | { type: 'incrementKeyPressId' }
  // ...

export function useTrainerState() {
  const [state, dispatch] = useReducer(reducer, initialState)
  // ... 返回状态和更新函数
}
```

**成果**:
- 使用 `useReducer` 替代 20+ 个 `useState`
- 提取 `useTrainerDerived` 计算派生状态
- 代码结构更清晰，易于维护

#### 2.2 优化 pinyin 调用 ✅
**状态**: 已完成
**优先级**: 中
**影响文件**:
- `src/lib/converter.ts`

**实现方案**:
```typescript
// 优化前：调用 3 次 pinyin()
const result = pinyin(text, { type: 'array' })
const initials = pinyin(text, { pattern: 'initial' })
const finals = pinyin(text, { pattern: 'final' })

// 优化后：调用 1 次
const result = pinyin(text, { type: 'all', toneType: 'none', v: true })
```

**成果**: API 调用减少 67%

#### 2.3 Keyboard 组件 memo 优化 ✅
**状态**: 已完成
**优先级**: 中
**影响文件**:
- `src/components/Keyboard.tsx`

**实现方案**:
```typescript
import { memo } from 'react'

function Keyboard({ ... }: KeyboardProps) {
  // 组件实现
}

export default memo(Keyboard)
```

**成果**: 避免不必要的重渲染

---

### 第三阶段：SEO 与可访问性 ✅

#### 3.1 完善 Meta 标签 ✅
**状态**: 已完成
**优先级**: 高
**影响文件**:
- `src/app/layout.tsx`

**添加内容**:
```typescript
export const metadata: Metadata = {
  title: '小鹤双拼练习器 - 在线学习双拼输入法',
  description: '免费在线小鹤双拼练习工具，支持可视化键盘、实时提示...',
  keywords: ['双拼', '小鹤双拼', '打字练习', '拼音输入法'],
  openGraph: {
    title: '小鹤双拼练习器',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary',
  },
  robots: { index: true, follow: true },
}
```

#### 3.2 添加无障碍属性 ✅
**状态**: 已完成
**优先级**: 中
**影响文件**:
- `src/components/Trainer.tsx`

**添加内容**:
- 为 emoji 按钮添加 `aria-label` 属性
- 为音量滑块添加 `aria-label`
- 为输入框添加 `aria-label`

---

### 第四阶段：构建与配置优化 ✅

#### 4.1 完善 Next.js 配置 ✅
**状态**: 已完成
**优先级**: 中
**影响文件**:
- `next.config.js`

**添加内容**:
```javascript
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ]
  },
}
```

#### 4.2 优化 Service Worker 缓存 ✅
**状态**: 已完成
**优先级**: 低
**影响文件**:
- `public/sw.js`

**优化内容**:
- 音效文件采用「缓存优先」策略
- 其他资源采用「网络优先」策略
- 升级缓存版本号 v1 → v2

---

### 第五阶段：类型安全与代码质量 ✅

#### 5.1 修复 TypeScript any 类型 ✅
**状态**: 已完成
**优先级**: 中
**影响文件**:
- `src/app/api/random-text/route.ts`

**实现方案**:
```typescript
// 定义 API 响应类型
interface HitokotoResponse {
  hitokoto: string
}

interface JinrishiciResponse {
  content: string
}

interface ApiConfig {
  name: string
  url: string
  parse: (data: ApiResponse) => string
}
```

#### 5.2 添加 localStorage 数据验证 ✅
**状态**: 已完成
**优先级**: 低
**影响文件**:
- `src/lib/learning.ts`

**实现方案**:
```typescript
// 类型守卫函数
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value)
}

// 安全解析函数
function safeParse<T>(data: string | null, fallback: T, validate: (value: unknown) => value is T): T {
  if (!data) return fallback
  try {
    const parsed = JSON.parse(data)
    return validate(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

// 使用示例
export function getErrorRecords(): Record<string, ErrorRecord> {
  if (typeof window === 'undefined') return {}
  return safeParse(localStorage.getItem('shuangpin_errors'), {}, isErrorRecordMap)
}
```

**成果**: 防止 localStorage 数据损坏导致的崩溃

---

### 第六阶段：性能监控 ✅ (额外完成)

#### 6.1 添加 Web Vitals 监控 ✅
**状态**: 已完成
**优先级**: 中
**影响文件**:
- `src/components/WebVitals.tsx` (新建)
- `src/app/layout.tsx`

**实现方案**:
```typescript
// src/components/WebVitals.tsx
'use client'

import { useEffect } from 'react'
import { onCLS, onFID, onINP, onLCP, onTTFB, type Metric } from 'web-vitals'

function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify(metric)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', body)
  } else {
    fetch('/api/vitals', { method: 'POST', body, keepalive: true })
  }
}

export default function WebVitals() {
  useEffect(() => {
    onCLS(sendToAnalytics)
    onFID(sendToAnalytics)
    onINP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  }, [])
  return null
}
```

**监控指标**:
- **CLS** (Cumulative Layout Shift) - 累积布局偏移
- **FID** (First Input Delay) - 首次输入延迟
- **INP** (Interaction to Next Paint) - 交互到下一次绘制
- **LCP** (Largest Contentful Paint) - 最大内容绘制
- **TTFB** (Time to First Byte) - 首字节时间

---

## 实施总结

### 完成任务统计

| 序号 | 任务 | 改动文件数 | 状态 |
|:----:|------|:----------:|:----:|
| 1 | 抽取公共 Theme Hook | 8 | ✅ |
| 2 | 完善 SEO Meta 标签 | 1 | ✅ |
| 3 | 完善 Next.js 配置 | 1 | ✅ |
| 4 | 统一重复函数 | 3 | ✅ |
| 5 | 优化 pinyin 调用 | 1 | ✅ |
| 6 | 添加无障碍属性 | 1 | ✅ |
| 7 | 修复 TypeScript 类型 | 1 | ✅ |
| 8 | 优化 Service Worker | 1 | ✅ |
| 9 | 优化 Trainer 状态管理 | 3 | ✅ |
| 10 | localStorage 数据验证 | 1 | ✅ |
| 11 | Web Vitals 性能监控 | 2 | ✅ |

### 新增文件

| 文件 | 说明 |
|------|------|
| `src/hooks/useTheme.ts` | 统一主题样式 hook |
| `src/hooks/useTrainerState.ts` | Trainer 状态管理 (useReducer) |
| `src/hooks/useTrainerDerived.ts` | Trainer 派生状态计算 |
| `src/components/WebVitals.tsx` | Web Vitals 性能监控 |
| `docs/OPTIMIZATION.md` | 本优化计划文档 |

### 代码优化成果

- ✅ 减少重复代码 ~150 行
- ✅ pinyin API 调用减少 67%
- ✅ 状态管理从 20+ useState 重构为 useReducer
- ✅ 添加 localStorage 数据验证，防止崩溃
- ✅ Keyboard 组件使用 memo 避免重渲染
- ✅ 完善 SEO 元数据
- ✅ 添加无障碍属性
- ✅ Web Vitals 性能监控

---

## 验证方案

1. **构建验证**: `npm run build` ✅ 无错误
2. **本地测试**: `npm run dev`
   - [x] 打字练习功能正常
   - [x] 主题切换正常
   - [x] 音效播放正常
   - [x] 统计数据正常显示
   - [x] localStorage 数据恢复正常
3. **部署验证**: 推送到 GitHub 后 Vercel 自动构建 ✅

---

## 提交记录

| 日期 | 提交 | 说明 |
|------|------|------|
| 2026-01-11 | `1a7f9a2` | 修复构建错误 (parsePinyinParts) |
| 2026-01-11 | `56c648f` | 完成 8 项优化任务 |
| 2026-01-11 | `76344fa` | 添加优化计划文档 |
| 2026-01-11 | - | 完成剩余优化 (状态管理、数据验证、性能监控) |

---

## 项目优化完成 🎉

所有计划任务已全部完成，项目优化圆满结束！
