# 爆款文章生成器

基于爆款结构模板的自动化文章生成工具，帮助你快速创作高质量的技术文章、产品介绍和教程内容。

## 特点

- 🎯 **结构化模板**：基于经过验证的爆款文章结构（钩子-冲击-揭秘-实操-强化-教程-福利）
- ⚙️ **配置驱动**：通过 JSON 配置文件快速生成文章，无需从零编写
- 🔄 **可复用**：模板和配置分离，一次创建，多次使用
- ✅ **验证工具**：内置配置验证脚本，确保配置完整性
- 📊 **统计分析**：自动统计字数、阅读时长等关键指标

## 目录结构

```
viral-article-generator/
├── templates/              # 文章模板
│   └── tech-tool-template.md     # 技术工具类模板
├── examples/               # 配置示例
│   └── clawdbot-config.json      # Clawdbot 文章配置
├── scripts/                # 脚本工具
│   ├── generate.js         # 文章生成脚本
│   └── validate.js         # 配置验证脚本
├── output/                 # 生成的文章输出目录
├── README.md               # 使用文档
└── package.json            # 项目配置
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 验证配置文件

```bash
npm run validate examples/clawdbot-config.json
```

### 3. 生成文章

```bash
npm run generate examples/clawdbot-config.json
```

生成的文章会保存到 `output/clawdbot.md`

## 使用指南

### 基础用法

```bash
# 生成文章（使用默认输出路径）
node scripts/generate.js examples/clawdbot-config.json

# 指定输出路径
node scripts/generate.js examples/clawdbot-config.json -o custom/path.md

# 生成多种格式
node scripts/generate.js examples/clawdbot-config.json --formats md,html
```

### 验证配置

```bash
# 验证配置文件
node scripts/validate.js examples/clawdbot-config.json
```

### 创建新文章

1. **复制配置模板**

```bash
cp examples/clawdbot-config.json examples/my-project-config.json
```

2. **编辑配置文件**

打开 `examples/my-project-config.json`，根据你的项目修改以下内容：

- `meta`: 文章元信息（标题、字数、阅读时长）
- `hook`: 开头钩子（场景、发现、惊喜）
- `project`: 项目信息（名称、链接、社交证明）
- `installation`: 安装教程
- `use_cases`: 实际用例
- `cta`: 行动引导和福利

3. **验证配置**

```bash
npm run validate examples/my-project-config.json
```

4. **生成文章**

```bash
npm run generate examples/my-project-config.json
```

## 配置文件说明

配置文件是一个 JSON 格式的文件，包含以下主要部分：

### meta（元信息）

```json
{
  "meta": {
    "template": "tech-tool-template",  // 使用的模板名称
    "title": "文章标题",               // 文章标题
    "word_count": "3500",              // 预计字数
    "reading_time": "8-10 分钟",       // 预计阅读时长
    "image_count": "10+"               // 配图数量
  }
}
```

### hook（钩子）

开头吸引读者的部分：

```json
{
  "hook": {
    "scenario": "日常场景描述",        // 场景代入
    "discovery": "发现了什么",         // 发现描述
    "surprise": "制造惊喜",            // 惊喜元素
    "visual_type": "GIF",              // 视觉类型
    "visual_description": "视觉描述"   // 视觉说明
  }
}
```

### project（项目信息）

```json
{
  "project": {
    "name": "项目名称",
    "tagline": "项目简介",
    "github_url": "GitHub 链接",
    "website": "官网链接",
    "github_stars": "10k+",
    "social_proof": ["社交证明1", "社交证明2"]
  }
}
```

### use_cases（用例）

实际使用场景：

```json
{
  "use_cases": [
    {
      "title": "用例标题",
      "command": "用户输入的命令",
      "result": "执行结果",
      "impact": "影响和感受",
      "visual": "配图说明（可选）"
    }
  ]
}
```

### installation（安装教程）

```json
{
  "installation": {
    "prerequisites": ["前置要求1", "前置要求2"],
    "steps": [
      {
        "step": 1,
        "title": "步骤标题",
        "command": "执行命令",
        "validation": "验证方式",
        "screenshot": true
      }
    ],
    "common_issues": [
      {
        "question": "常见问题",
        "answer": "答案"
      }
    ]
  }
}
```

### cta（行动引导）

```json
{
  "cta": {
    "benefits": [
      {
        "title": "福利标题",
        "description": "福利描述"
      }
    ]
  }
}
```

## 模板变量

模板使用 Handlebars 语法，支持以下变量和辅助函数：

### 基础变量

- `{{title}}` - 文章标题
- `{{project.name}}` - 项目名称
- `{{project.website}}` - 项目官网
- 等等...

### 辅助函数

- `{{#each array}}` - 遍历数组
- `{{#if condition}}` - 条件判断
- `{{@index}}` - 当前索引（从 0 开始）
- `{{@index_plus_1}}` - 当前索引 + 1

### 示例

```handlebars
{{#each use_cases}}
### 场景 {{@index_plus_1}}：{{this.title}}

{{this.description}}

**{{this.impact}}**
{{/each}}
```

## 爆款文章结构

本框架基于以下 7 步爆款文章结构：

### 1. 【钩子】场景代入 + 悬念
- 日常场景切入
- 制造好奇心
- 吸引读者继续阅读

### 2. 【冲击】展示效果 + 制造反差
- 展示震撼的效果
- 打破读者认知
- 建立期待

### 3. 【揭秘】背后的工具/方法
- 揭示秘密武器
- 建立信任
- 提供技术细节

### 4. 【实操】亲身体验
- 作者亲自测试
- 展示真实效果
- 降低距离感

### 5. 【强化】更多用例
- 多个实际场景
- 证明可复用性
- 激发想象

### 6. 【教程】保姆级步骤
- 详细安装步骤
- 可直接复制的命令
- 截图和验证方式

### 7. 【福利】资源 + 行动引导
- 免费资源
- 明确的 CTA
- 降低行动门槛

## 最佳实践

### 标题公式

`新奇概念 + 实用价值承诺`

示例：
- ✅ 像写代码一样做特效动画（附Claude Code保姆级配置）
- ✅ 告别只会聊天的AI：这个开源项目让我在床上用手机遥控电脑干活
- ❌ Clawdbot 使用教程（太平淡）

### 反差技巧

- 看起来像 A → 实际是 B
- 传统方式 vs 新方法
- 付费产品 vs 开源免费

### 视觉证据

- 每个关键功能都配 GIF/截图
- 代码块要有语法高亮
- 终端命令要可复制

### 降低门槛

- 强调"保姆级"、"一键安装"
- 提供完整的配置文件
- 列出常见问题解答

### 行动引导

- 明确的福利（免费资源、工具包）
- 简单的获取方式（回复关键词、扫码）
- 社群归属感（加入交流群）

## 扩展模板

你可以创建自己的模板：

1. 在 `templates/` 目录创建新模板文件（如 `my-template.md`）
2. 使用 Handlebars 语法定义模板结构
3. 在配置文件的 `meta.template` 指定模板名称
4. 运行生成脚本

## 常见问题

### Q: 如何添加新的模板？

在 `templates/` 目录创建新的 `.md` 文件，使用 Handlebars 语法编写模板。

### Q: 配置文件验证失败怎么办？

运行 `npm run validate` 查看详细错误信息，根据提示修复配置文件。

### Q: 可以生成 PDF 吗？

当前版本暂不支持 PDF 生成，可以先生成 HTML 然后使用浏览器打印为 PDF。

### Q: 如何自定义模板变量？

在配置文件中添加任意自定义字段，然后在模板中使用 `{{your_field}}` 引用。

## 贡献

欢迎贡献新的模板和改进建议！

1. Fork 本项目
2. 创建特性分支
3. 提交改动
4. 发起 Pull Request

## 许可证

MIT License

---

## 示例文章

查看 `output/` 目录中的示例文章，了解生成效果。

## 技术栈

- Node.js
- Handlebars.js (模板引擎)
- 原生 JavaScript (无额外依赖)

---

**Happy Writing! 🚀**
