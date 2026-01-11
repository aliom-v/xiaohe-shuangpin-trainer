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
    // 按钮
    btn: 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600',
    btnSecondary: 'bg-gray-700 hover:bg-gray-600 text-gray-300',
    cardHover: 'hover:bg-gray-700',
    // 进度条背景
    bar: 'bg-gray-700',
    // 统计卡片
    statCard: 'bg-gray-700',
    // 代码/示例区域
    codeBlock: 'bg-gray-700',
    // 高亮区域
    highlightBlue: 'bg-blue-900/30 border border-blue-500/30',
    highlightYellow: 'bg-yellow-900/30',
    highlightRed: 'bg-red-900/30',
    highlightGreen: 'bg-green-900/30 border border-green-500/30',
    // 快捷键标签
    kbd: 'bg-gray-600 text-gray-200',
    // 进度指示器
    progressInactive: 'bg-gray-700',
    // 键盘专用
    key: 'bg-gray-700 border-gray-600 text-gray-200',
    keyHover: 'hover:bg-gray-600 active:bg-gray-500',
    initial: 'text-blue-400',
    final: 'text-green-400',
    legend: 'text-gray-400',
    tooltip: 'bg-gray-900 text-white border border-gray-700',
    // 成就未解锁
    achievementLocked: 'bg-gray-700/50 opacity-60',
    // 小按钮（编辑、重置等）
    btnSmall: 'bg-gray-700/60 text-gray-200 hover:bg-gray-600',
    // 手动标签
    tagManual: 'bg-yellow-700/60 text-yellow-200',
    // 错误提示背景
    errorHintWrong: 'bg-red-900/50',
    errorHintCorrect: 'bg-green-900/50',
    errorHintTarget: 'text-yellow-300',
    // 禁用按钮
    btnDisabled: 'bg-gray-600 text-gray-400 cursor-not-allowed',
  } : {
    // 基础
    bg: 'bg-gray-50',
    card: 'bg-white shadow-sm',
    text: 'text-gray-900',
    textMuted: 'text-gray-600',
    border: 'border-gray-300',
    // 输入框
    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
    // 按钮
    btn: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300',
    btnSecondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
    cardHover: 'hover:bg-gray-50',
    // 进度条背景
    bar: 'bg-gray-200',
    // 统计卡片
    statCard: 'bg-gray-100',
    // 代码/示例区域
    codeBlock: 'bg-gray-100',
    // 高亮区域
    highlightBlue: 'bg-blue-100 border border-blue-300',
    highlightYellow: 'bg-yellow-100',
    highlightRed: 'bg-red-100',
    highlightGreen: 'bg-green-100 border border-green-300',
    // 快捷键标签
    kbd: 'bg-gray-200 text-gray-700',
    // 进度指示器
    progressInactive: 'bg-gray-300',
    // 键盘专用
    key: 'bg-white border-gray-300 text-gray-700 shadow-sm',
    keyHover: 'hover:bg-gray-100 active:bg-gray-200',
    initial: 'text-blue-600',
    final: 'text-green-600',
    legend: 'text-gray-600',
    tooltip: 'bg-gray-800 text-white',
    // 成就未解锁
    achievementLocked: 'bg-gray-200 opacity-60',
    // 小按钮（编辑、重置等）
    btnSmall: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    // 手动标签
    tagManual: 'bg-yellow-200 text-yellow-800',
    // 错误提示背景
    errorHintWrong: 'bg-red-100',
    errorHintCorrect: 'bg-green-100',
    errorHintTarget: 'text-yellow-600',
    // 禁用按钮
    btnDisabled: 'bg-gray-300 text-gray-400 cursor-not-allowed',
  }
}

export type Theme = ReturnType<typeof useTheme>
