# 小鹤双拼练习器

一个功能丰富的小鹤双拼在线练习工具。

**在线体验：** [https://xiaohe-shuangpin-trainer.vercel.app](https://xiaohe-shuangpin-trainer.vercel.app)

## 功能特性

- 🎹 可视化键盘，实时高亮下一个键位
- 🔊 打字音效
- 🌓 亮色/暗色主题
- 📱 移动端适配，支持触摸输入
- 📖 新手教程
- 🎯 专项练习（变位声母/复杂韵母/零声母）
- 💡 提示模式 / 🙈 盲打模式 / ⏱️ 限时挑战
- 🔤 1-2 字母拼音可直接输入，其余按双拼规则（可在顶部开关）
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

## 本地运行

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 快速检查

```bash
npm test
```

## 音效包

开源音效包来自 Mechvibes（MIT），详细来源见 `public/sounds/mechvibes/ATTRIBUTION.md`。

## 部署

推荐使用 Vercel 一键部署：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aliom-v/xiaohe-shuangpin-trainer)

## License

MIT
