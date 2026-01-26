#!/usr/bin/env node

/**
 * 配置文件验证脚本
 *
 * 功能：
 * - 验证 JSON 配置文件的格式
 * - 检查必填字段
 * - 检查字段类型
 * - 提供详细的错误提示
 *
 * 使用方式：
 * node validate.js <config-file>
 *
 * 示例：
 * node validate.js examples/clawdbot-config.json
 */

const fs = require('fs');
const path = require('path');

// 定义配置文件的 schema
const schema = {
  meta: {
    required: true,
    fields: {
      template: { type: 'string', required: true },
      title: { type: 'string', required: true },
      word_count: { type: 'string', required: false },
      reading_time: { type: 'string', required: false },
      image_count: { type: 'string', required: false }
    }
  },
  hook: {
    required: true,
    fields: {
      scenario: { type: 'string', required: true },
      discovery: { type: 'string', required: true },
      surprise: { type: 'string', required: true }
    }
  },
  project: {
    required: true,
    fields: {
      name: { type: 'string', required: true },
      tagline: { type: 'string', required: false },
      github_url: { type: 'string', required: false },
      website: { type: 'string', required: false }
    }
  },
  installation: {
    required: true,
    fields: {
      prerequisites: { type: 'array', required: true },
      steps: { type: 'array', required: true }
    }
  },
  use_cases: {
    required: true,
    type: 'array'
  },
  cta: {
    required: true,
    fields: {
      benefits: { type: 'array', required: true }
    }
  }
};

// 验证结果
let errors = [];
let warnings = [];

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

// 验证字段类型
function validateType(value, expectedType, fieldPath) {
  const actualType = Array.isArray(value) ? 'array' : typeof value;

  if (actualType !== expectedType) {
    errors.push(`字段 "${fieldPath}" 类型错误: 期望 ${expectedType}，实际 ${actualType}`);
    return false;
  }
  return true;
}

// 验证对象字段
function validateObject(obj, schema, parentPath = '') {
  for (const [key, rules] of Object.entries(schema)) {
    const fieldPath = parentPath ? `${parentPath}.${key}` : key;
    const value = obj[key];

    // 检查必填字段
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`缺少必填字段: ${fieldPath}`);
      continue;
    }

    // 跳过可选且未提供的字段
    if (!value && !rules.required) {
      continue;
    }

    // 验证嵌套对象
    if (rules.fields) {
      if (!validateType(value, 'object', fieldPath)) continue;
      validateObject(value, rules.fields, fieldPath);
    }
    // 验证数组
    else if (rules.type === 'array') {
      validateType(value, 'array', fieldPath);
    }
    // 验证简单类型
    else if (rules.type) {
      validateType(value, rules.type, fieldPath);
    }
  }
}

// 验证配置完整性
function validateConfig(config) {
  console.log('🔍 开始验证配置文件...\n');

  // 验证顶层结构
  validateObject(config, schema);

  // 额外的业务逻辑验证
  if (config.use_cases && config.use_cases.length === 0) {
    warnings.push('建议至少提供 2-3 个用例 (use_cases)');
  }

  if (config.installation && config.installation.steps) {
    if (config.installation.steps.length < 3) {
      warnings.push('安装步骤较少，建议至少 3 步以上');
    }
  }

  if (config.meta && config.meta.title) {
    const title = config.meta.title;
    if (title.length < 20) {
      warnings.push('标题较短，建议 20-50 字以获得更好的点击率');
    }
    if (!title.includes('（') && !title.includes('(')) {
      warnings.push('标题中建议加入括号部分（如：附教程、附资源等）');
    }
  }

  // 输出验证结果
  console.log('验证结果：');
  console.log('─'.repeat(50));

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ 配置文件验证通过！');
    return true;
  }

  if (errors.length > 0) {
    console.log('\n❌ 发现错误:');
    errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  警告信息:');
    warnings.forEach((warning, index) => {
      console.log(`  ${index + 1}. ${warning}`);
    });
  }

  console.log('\n' + '─'.repeat(50));

  return errors.length === 0;
}

// 显示配置统计
function showStats(config) {
  console.log('\n📊 配置统计:');
  console.log('─'.repeat(50));

  if (config.meta) {
    console.log(`标题: ${config.meta.title}`);
    console.log(`模板: ${config.meta.template}`);
    if (config.meta.word_count) {
      console.log(`预计字数: ${config.meta.word_count}`);
    }
  }

  if (config.use_cases) {
    console.log(`用例数量: ${config.use_cases.length}`);
  }

  if (config.installation && config.installation.steps) {
    console.log(`安装步骤: ${config.installation.steps.length} 步`);
  }

  if (config.cta && config.cta.benefits) {
    console.log(`CTA 福利: ${config.cta.benefits.length} 个`);
  }

  console.log('─'.repeat(50));
}

// 主函数
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
配置文件验证工具

使用方式:
  node validate.js <config-file>

示例:
  node validate.js examples/clawdbot-config.json

选项:
  -h, --help    显示帮助信息
    `);
    process.exit(0);
  }

  const configFile = args[0];

  console.log('🚀 配置文件验证工具\n');
  console.log(`📄 文件: ${configFile}\n`);

  const config = loadConfig(configFile);
  const isValid = validateConfig(config);

  if (isValid) {
    showStats(config);
    console.log('\n✨ 配置文件可以使用！');
    process.exit(0);
  } else {
    console.log('\n❌ 配置文件存在错误，请修复后重试');
    process.exit(1);
  }
}

// 运行
main();
