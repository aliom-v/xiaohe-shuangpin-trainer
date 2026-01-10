/**
 * 统一的主题 hook，提供亮色/暗色模式样式
 */
export function useTheme(darkMode: boolean) {
  return darkMode ? {
    // 基础
    bg: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-white',
    textMuted: 'text-gray-400',
    border: 'border-gray-600',
    // 输入框
    input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
    // 按钮 - 增加对比度
    btn: 'bg-gray-600 hover:bg-gray-500 text-white border border-gray-500',
    cardHover: 'hover:bg-gray-700',
    // 进度条背景
    bar: 'bg-gray-700',
    // 键盘专用
    key: 'bg-gray-700 border-gray-600 text-gray-200',
    keyHover: 'hover:bg-gray-600 active:bg-gray-500',
    initial: 'text-blue-400',
    final: 'text-green-400',
    legend: 'text-gray-400',
    tooltip: 'bg-gray-900 text-white border border-gray-700',
  } : {
    // 基础
    bg: 'bg-gray-50',
    card: 'bg-white shadow-sm',
    text: 'text-gray-900',
    textMuted: 'text-gray-600',
    border: 'border-gray-300',
    // 输入框
    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
    // 按钮 - 增加对比度
    btn: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300',
    cardHover: 'hover:bg-gray-50',
    // 进度条背景
    bar: 'bg-gray-200',
    // 键盘专用
    key: 'bg-white border-gray-300 text-gray-700 shadow-sm',
    keyHover: 'hover:bg-gray-100 active:bg-gray-200',
    initial: 'text-blue-600',
    final: 'text-green-600',
    legend: 'text-gray-600',
    tooltip: 'bg-gray-800 text-white',
  }
}

export type Theme = ReturnType<typeof useTheme>
