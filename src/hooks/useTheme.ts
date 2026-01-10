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
    border: 'border-gray-700',
    // 输入框
    input: 'bg-gray-700 border-gray-600',
    // 按钮
    btn: 'bg-gray-700 hover:bg-gray-600',
    cardHover: 'hover:bg-gray-700',
    // 进度条背景
    bar: 'bg-gray-700',
    // 键盘专用
    key: 'bg-gray-700 border-gray-900 text-gray-300',
    keyHover: 'hover:bg-gray-600 active:bg-gray-500',
    initial: 'text-blue-400',
    final: 'text-green-400',
    legend: 'text-gray-400',
    tooltip: 'bg-gray-900 text-white',
  } : {
    // 基础
    bg: 'bg-gray-100',
    card: 'bg-white',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    border: 'border-gray-300',
    // 输入框
    input: 'bg-white border-gray-300',
    // 按钮
    btn: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    cardHover: 'hover:bg-gray-50',
    // 进度条背景
    bar: 'bg-gray-200',
    // 键盘专用
    key: 'bg-gray-100 border-gray-300 text-gray-700',
    keyHover: 'hover:bg-gray-200 active:bg-gray-300',
    initial: 'text-blue-600',
    final: 'text-green-600',
    legend: 'text-gray-500',
    tooltip: 'bg-gray-800 text-white',
  }
}

export type Theme = ReturnType<typeof useTheme>
