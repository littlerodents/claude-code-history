# Claude Code History

与 Claude 对话的历史存档仓库 —— 记录有价值的项目、代码和解决方案。

## 这是什么？

每次和 Claude 完成一个有意义的对话后，Claude 会**主动询问**是否要保存到这个仓库。存档包含：
- 对话总结 (`PROJECT-SUMMARY.md`)
- 完整的代码和配置文件
- 可复用的模板和框架

## 仓库结构

```
claude-code-history/
├── .claude/
│   └── CLAUDE.md                    # Claude 配置（让它知道要主动问）
├── README.md                        # 本文件
│
├── 2026-01-26/
│   └── 爆款文章生成框架/
│       ├── PROJECT-SUMMARY.md       # 项目总结
│       ├── clawdbot-article.md      # 生成的文章
│       └── viral-article-generator/ # 可复用框架
│
├── 2026-01-29/
│   └── moltbot-video-remotion/      # Remotion 视频项目
│
└── 2026-02-06/
    └── 七牛云抢票视频-remotion/     # 60秒短视频项目
        ├── PROJECT-SUMMARY.md
        └── src/                     # 完整源代码
```

## 如何使用

### 1. 自动触发
当你在 `claude-code-history` 目录下和 Claude 对话时，Claude 会：
- 读取 `.claude/CLAUDE.md` 配置
- 在对话结束时**主动询问**是否保存

### 2. 保存流程
Claude 会问：
> 📦 **是否需要保存本次对话到 claude-code-history？**
>
> 回复 "是" 确认，"否" 跳过。

确认后自动：
- 创建日期目录
- 生成 PROJECT-SUMMARY.md
- 复制相关文件
- Git commit

### 3. 查找历史
按日期浏览，每个项目都有 `PROJECT-SUMMARY.md` 说明做了什么、怎么用。

## 存档标准

### 应该保存
- ✅ 完整的项目开发
- ✅ 可复用的代码/模板
- ✅ 解决复杂问题的方案
- ✅ 有价值的配置和脚本

### 不需要保存
- ❌ 简单问答
- ❌ 临时调试
- ❌ 未完成的实验
- ❌ 包含敏感信息的内容

## 已存档项目

| 日期 | 项目 | 描述 |
|------|------|------|
| 2026-01-26 | 爆款文章生成框架 | Handlebars 模板 + 7步爆款结构 |
| 2026-01-29 | moltbot-video-remotion | Remotion 视频项目 |
| 2026-02-06 | 七牛云抢票视频 | 60秒短视频，120fps |

---

> 💡 **提示**：这个仓库的核心是 `.claude/CLAUDE.md` 配置文件，它让 Claude 知道要在对话结束时主动询问保存。
