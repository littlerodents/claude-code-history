#!/usr/bin/env node

/**
 * 爆款文章生成脚本
 *
 * 功能：
 * - 读取 JSON 配置文件
 * - 根据模板生成文章
 * - 支持多种输出格式（Markdown, HTML, PDF）
 *
 * 使用方式：
 * node generate.js <config-file> [options]
 *
 * 示例：
 * node generate.js examples/clawdbot-config.json
 * node generate.js examples/clawdbot-config.json -o output/article.md
 * node generate.js examples/clawdbot-config.json --formats md,html
 */

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// 注册 Handlebars 辅助函数
Handlebars.registerHelper('index_plus_1', function(index) {
  return index + 1;
});

Handlebars.registerHelper('if', function(conditional, options) {
  if (conditional) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('unless', function(conditional, options) {
  if (!conditional) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('each', function(context, options) {
  let ret = '';
  for (let i = 0; i < context.length; i++) {
    ret += options.fn({
      ...context[i],
      '@index': i,
      '@index_plus_1': i + 1,
      '@first': i === 0,
      '@last': i === context.length - 1
    });
  }
  return ret;
});

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
爆款文章生成器

使用方式:
  node generate.js <config-file> [options]

选项:
  -o, --output <file>      指定输出文件路径 (默认: output/<config-name>.md)
  --formats <formats>      输出格式，逗号分隔 (默认: md)
                          可选: md, html, pdf
  -h, --help              显示帮助信息

示例:
  node generate.js examples/clawdbot-config.json
  node generate.js examples/clawdbot-config.json -o custom/path.md
  node generate.js examples/clawdbot-config.json --formats md,html
    `);
    process.exit(0);
  }

  const configFile = args[0];
  let outputFile = null;
  let formats = ['md'];

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '-o' || args[i] === '--output') {
      outputFile = args[i + 1];
      i++;
    } else if (args[i] === '--formats') {
      formats = args[i + 1].split(',').map(f => f.trim());
      i++;
    }
  }

  return { configFile, outputFile, formats };
}

// 读取配置文件
function loadConfig(configPath) {
  try {
    const absolutePath = path.resolve(configPath);
    const content = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ 读取配置文件失败: ${error.message}`);
    process.exit(1);
  }
}

// 读取模板文件
function loadTemplate(templateName) {
  try {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.md`);
    return fs.readFileSync(templatePath, 'utf-8');
  } catch (error) {
    console.error(`❌ 读取模板文件失败: ${error.message}`);
    process.exit(1);
  }
}

// 生成文章
function generateArticle(config) {
  const templateContent = loadTemplate(config.meta.template);
  const template = Handlebars.compile(templateContent);

  try {
    return template(config);
  } catch (error) {
    console.error(`❌ 生成文章失败: ${error.message}`);
    process.exit(1);
  }
}

// 保存文件
function saveFile(content, outputPath) {
  try {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, content, 'utf-8');
    console.log(`✅ 文件已生成: ${outputPath}`);
  } catch (error) {
    console.error(`❌ 保存文件失败: ${error.message}`);
    process.exit(1);
  }
}

// 生成 HTML（简单转换）
function convertToHTML(markdown) {
  // 这是一个简化的 Markdown 到 HTML 转换
  // 实际使用时建议使用 marked 或其他 markdown 解析库
  let html = markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文章</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1, h2, h3 { margin-top: 24px; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 16px; border-radius: 6px; overflow-x: auto; }
  </style>
</head>
<body>
  <p>${html}</p>
</body>
</html>`;
}

// 主函数
function main() {
  console.log('🚀 爆款文章生成器\n');

  const { configFile, outputFile, formats } = parseArgs();

  console.log(`📄 读取配置文件: ${configFile}`);
  const config = loadConfig(configFile);

  console.log(`📝 使用模板: ${config.meta.template}`);
  const article = generateArticle(config);

  // 确定输出文件名
  let baseOutputPath;
  if (outputFile) {
    baseOutputPath = outputFile.replace(/\.\w+$/, ''); // 移除扩展名
  } else {
    const configName = path.basename(configFile, '.json');
    baseOutputPath = path.join(__dirname, '..', 'output', configName);
  }

  // 生成各种格式
  formats.forEach(format => {
    switch (format) {
      case 'md':
        saveFile(article, `${baseOutputPath}.md`);
        break;
      case 'html':
        const html = convertToHTML(article);
        saveFile(html, `${baseOutputPath}.html`);
        break;
      case 'pdf':
        console.log('⚠️  PDF 格式需要额外的依赖（如 puppeteer），当前版本暂不支持');
        break;
      default:
        console.warn(`⚠️  未知格式: ${format}`);
    }
  });

  console.log('\n✨ 生成完成！');
  console.log('\n📊 文章统计:');
  console.log(`   字数: ${config.meta.word_count}`);
  console.log(`   阅读时长: ${config.meta.reading_time}`);
  console.log(`   配图需求: ${config.meta.image_count}`);
}

// 运行
main();
