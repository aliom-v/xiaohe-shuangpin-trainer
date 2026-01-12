# 小鹤双拼练习器

一个功能丰富的小鹤双拼在线练习工具。

**在线体验：** [https://xiaohe-shuangpin-trainer.vercel.app](https://xiaohe-shuangpin-trainer.vercel.app)

## 一键部署（Vercel）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aliom-v/xiaohe-shuangpin-trainer)

## 快速上手

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 环境要求

- Node.js 18+（建议 20 LTS）
- npm（随 Node 安装）

## 使用说明

- 练习文本：粘贴文本、随机文本、在线文本或自定义模式。
- 模式切换：提示/盲打/限时/专项练习，支持自动下一段。
- 1-2 全拼：开启后 1-2 字母拼音可直接输入，也可用对应双拼（如 xu/ju/qu/yu 或 xv/jv/qv/yv）。3+ 字母遵循小鹤双拼规则（如 xue → xt）。
- 多音字校正：点击拼音旁的 ✏️ 手动修改。
- 双拼查询：点击顶部 🔍 查询拼音对应双拼码。

## 快捷键

- `Space` 随机文本
- `Tab` 跳过当前字
- `Esc` 结束练习
- `Backspace` 退回输入

## 功能特性

- 🎹 可视化键盘，实时高亮下一个键位
- 🔊 打字音效
- 🌓 亮色/暗色主题
- 📱 移动端适配，支持触摸输入
- 📖 新手教程
- 🎯 专项练习（变位声母/复杂韵母/零声母）
- 💡 提示模式 / 🙈 盲打模式 / ⏱️ 限时挑战
- 🔤 1-2 字母拼音可直接输入，也可用对应双拼（可在顶部开关）
- ✏️ 多音字拼音可手动校正
- 🎧 可选开源机械键盘音效包（见 public/sounds/mechvibes）
- 📊 练习统计和错误分析
- 🌐 在线获取随机文本
- 🔄 自动下一段模式

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- pinyin-pro

## 常用命令

- `npm run dev` 本地开发
- `npm run build` 生产构建
- `npm run start` 生产启动
- `npm run lint` 代码检查
- `npm test` 双拼映射检查（`scripts/check-mappings.ts`）

## 音效包

开源音效包来自 Mechvibes（MIT），详细来源见 `public/sounds/mechvibes/ATTRIBUTION.md`。

## License

MIT
