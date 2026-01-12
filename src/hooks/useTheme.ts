/**
 * 统一的主题 hook，提供亮色/暗色模式样式
 * 现代简约设计，注重层次感和视觉美感
 */
export function useTheme() {
  return {
    // 基础 - 使用渐变感的背景层次
    bg: 'bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800',
    card: 'bg-white dark:bg-slate-800/90 shadow-lg dark:shadow-2xl dark:shadow-black/20 rounded-2xl backdrop-blur-sm border border-slate-100 dark:border-slate-700/50',
    text: 'text-slate-800 dark:text-slate-100',
    textMuted: 'text-slate-500 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700',

    // 悬浮菜单/下拉框
    dropdown: 'bg-white dark:bg-slate-800 shadow-xl dark:shadow-2xl rounded-xl border border-slate-100 dark:border-slate-700',

    // 输入框 - 精致边框
    input: 'bg-white dark:bg-slate-700/50 border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl',

    // 按钮 - 添加微妙的渐变和阴影
    btn: 'bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl shadow-sm hover:shadow transition-all duration-200',
    btnSecondary: 'bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-xl',

    cardHover: 'hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors',

    // 进度条背景
    bar: 'bg-slate-200 dark:bg-slate-700',

    // 统计卡片 - 添加边框和微妙阴影
    statCard: 'bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-600/30',

    // 代码/示例区域
    codeBlock: 'bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/50',

    // 高亮区域 - 更鲜艳的颜色
    highlightBlue: 'bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-100 dark:border-blue-500/30',
    highlightYellow: 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-xl border border-amber-100 dark:border-amber-500/30',
    highlightRed: 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 rounded-xl border border-rose-100 dark:border-rose-500/30',
    highlightGreen: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-100 dark:border-emerald-500/30',

    // 快捷键标签
    kbd: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600',

    // 进度指示器
    progressInactive: 'bg-slate-200 dark:bg-slate-700',

    // 键盘专用 - 3D 效果
    key: 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-100 shadow-[0_4px_0_0_#cbd5e1] dark:shadow-[0_4px_0_0_#1e293b] rounded-xl',
    keyHover: 'hover:bg-slate-50 dark:hover:bg-slate-600 active:translate-y-[3px] active:shadow-[0_1px_0_0_#cbd5e1] dark:active:shadow-[0_1px_0_0_#1e293b] transition-all duration-75',
    initial: 'text-blue-600 dark:text-blue-400',
    final: 'text-emerald-600 dark:text-emerald-400',
    legend: 'text-slate-500 dark:text-slate-400',
    tooltip: 'bg-slate-900 dark:bg-slate-700 text-white rounded-xl shadow-xl',

    // 成就
    achievementLocked: 'bg-slate-100 dark:bg-slate-800 opacity-50 grayscale rounded-xl',

    // 小按钮
    btnSmall: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors',

    // 标签
    tagManual: 'bg-amber-100 dark:bg-amber-500/25 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-500/40',

    // 错误提示
    errorHintWrong: 'bg-rose-100 dark:bg-rose-500/30',
    errorHintCorrect: 'bg-emerald-100 dark:bg-emerald-500/30',
    errorHintTarget: 'text-amber-600 dark:text-amber-400',

    // 禁用
    btnDisabled: 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50 rounded-xl',
  }
}

export type Theme = ReturnType<typeof useTheme>
