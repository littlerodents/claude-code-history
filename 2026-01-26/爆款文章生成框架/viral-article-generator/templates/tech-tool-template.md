# {{title}}

---

{{hook.scenario}}

{{hook.discovery}}

{{hook.first_impression}}

**{{hook.surprise}}**

`[{{hook.visual_type}}：{{hook.visual_description}}]`

---

顺着线索往下看，才发现这是一个叫 **{{project.name}}** 的开源项目。

和我们平时用的 ChatGPT、Claude 不太一样的是：

{{#each contrast}}
- **{{this.before}} → {{this.after}}**
{{/each}}

更离谱的是，这个项目已经在 GitHub 上获得了 **{{project.github_stars}} 星标**{{#if project.social_proof}}，{{#each project.social_proof}}{{this}}{{#unless @last}}、{{/unless}}{{/each}}{{/if}}。

`[截图：GitHub 仓库页面]`

我干脆照着思路，自己模仿着跑了一次完整流程。

---

## 实际体验：从怀疑到真香

**安装过程比我想象的简单很多。**

{{installation.quick_start_description}}

```bash
{{installation.quick_start_command}}
```

{{installation.quick_start_result}}

`[截图：终端安装过程]`

---

**配置完成后，我给它发了第一条测试消息：**

> "{{first_test.command}}"

几秒钟后，它回复：

> "{{first_test.response}}"

{{first_test.feeling}}

**{{first_test.insight}}**

---

## 震撼的实际用例

**然后我开始尝试一些真实的使用场景。**

{{#each use_cases}}
### 场景 {{@index_plus_1}}：{{this.title}}

{{#if this.description}}
{{this.description}}
{{/if}}

{{#if this.command}}
我跟它说：
> "{{this.command}}"
{{/if}}

{{this.result}}

{{#if this.code_example}}
```{{this.code_language}}
{{this.code_example}}
```
{{/if}}

**{{this.impact}}**

{{#if this.visual}}
`[{{this.visual}}]`
{{/if}}

---

{{/each}}

## 它的核心能力

用了几天之后，我总结了一下 {{project.name}} 的核心能力：

{{#each capabilities}}
### {{@index_plus_1}}. {{this.name}}
{{#each this.features}}
- {{this}}
{{/each}}

{{/each}}

---

## 它也不是万能的

**当然，它也不是万能的。**

在测试过程中，我也发现了一些限制：

{{#each limitations}}
{{@index_plus_1}}. **{{this.title}}**：{{this.description}}
{{/each}}

但瑕不掩瑜，这依然是我目前用过**最接近"真正 AI 助手"的开源项目。**

---

## 保姆级安装教程

如果你也想尝试，这里是完整的安装步骤（我亲测可用）：

### 前置要求
{{#each installation.prerequisites}}
- {{this}}
{{/each}}

---

{{#each installation.steps}}
### 步骤 {{this.step}}：{{this.title}}

{{#if this.description}}
{{this.description}}
{{/if}}

{{#if this.command}}
{{#if this.command_description}}
{{this.command_description}}
{{/if}}
```bash
{{this.command}}
```
{{/if}}

{{#if this.substeps}}
{{#each this.substeps}}
**{{this.title}}**
{{#if this.options}}
```
{{this.options}}
```
{{/if}}
{{#if this.note}}
{{this.note}}
{{/if}}
{{/each}}
{{/if}}

{{#if this.validation}}
验证：{{this.validation}}
{{/if}}

{{#if this.screenshot}}
`[截图：{{this.screenshot_description}}]`
{{/if}}

---

{{/each}}

## 常见问题

{{#each installation.common_issues}}
**Q: {{this.question}}**
A: {{this.answer}}

{{/each}}

---

## 福利时间

如果你看到这里，说明你真的对 {{project.name}} 感兴趣了！

我准备了一些福利：

{{#each cta.benefits}}
**福利 {{@index_plus_1}}：{{this.title}}**
{{this.description}}

{{/each}}

`[二维码占位符]`

---

## 写在最后

{{conclusion.reflection}}

{{conclusion.comparison}}

{{conclusion.evolution}}

{{conclusion.final_thought}}

**{{conclusion.cta}}**

---

### 相关链接

- 官网：{{project.website}}
- GitHub：{{project.github_url}}
- 文档：{{project.docs_url}}
{{#if project.tutorial_url}}
- 中文教程：{{project.tutorial_url}}
{{/if}}

---

📌 **点赞 + 在看**，让更多人看到这个宝藏项目！

{{#if comparison_table}}
---

## 附录：与竞品对比

| 功能 | {{project.name}} | {{#each comparison_table.competitors}}{{this}} | {{/each}}
|------|----------|{{#each comparison_table.competitors}}---------|{{/each}}
{{#each comparison_table.features}}
| {{this.name}} | {{this.self}} | {{#each this.others}}{{this}} | {{/each}}
{{/each}}
{{/if}}

---

**字数统计**：约 {{meta.word_count}} 字
**阅读时长**：{{meta.reading_time}}
**配图需求**：{{meta.image_count}} 截图/GIF（已标注占位符）

---

> **创作说明**：本文基于爆款结构模板撰写，遵循"钩子-冲击-揭秘-实操-强化-教程-福利"的 7 步框架。标题符合「新奇概念 + 实用价值承诺」公式，内容包含多个反差点、亲身验证和视觉证据，并提供了保姆级教程和明确的行动引导（CTA）。
