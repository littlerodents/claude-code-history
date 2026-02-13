# OpenClaw Agent 集群：从单体智能到群体涌现的技术全解

## 一、Agent 集群架构概述

单体 Agent 是一个独立进程，拥有自己的上下文、记忆和工具。当你启动多个 Agent，让它们各司其职、彼此通信、自主调度时，就构成了 **Agent 集群**。

集群的核心能力：

| 能力 | 描述 | 实现机制 |
|------|------|----------|
| **并行执行** | 多 Agent 同时处理不同任务 | `sessions_spawn` 启动独立容器 |
| **进程隔离** | 每个 Agent 独立沙盒，故障不传播 | Docker 容器 + namespace 隔离 |
| **异步协同** | 非阻塞消息传递，无需等待 | `sessions_send` 消息队列 |
| **自主调度** | 定时触发，无需人类干预 | `Heartbeat` 守护进程 |

OpenClaw 通过 `sessions_*` API 实现这四项能力。理解这三个 API（spawn、send、heartbeat）是掌握集群的关键。

---

## 二、三大底层机制深度解析

### 2.1 sessions_spawn — 进程级隔离的 Agent 创建

**原理**：每次 `sessions_spawn` 调用触发以下流程：

```
spawn(agent="reviewer", task="扫描依赖")
    ↓
Gateway 解析 config.json 中的 reviewer 配置
    ↓
启动 Docker 容器（独立 PID namespace、文件系统、网络栈）
    ↓
注入上下文：system prompt + 工具白名单 + 资源限制
    ↓
返回 session_id，用于状态查询
```

**生命周期管理**：

```
spawn() → [pending] → [running] → [complete|timeout|error] → cleanup()
          ↑                                    ↓
          └──────── retry（可配置）──────────┘
```

- **pending**：容器创建中
- **running**：Agent 执行任务
- **complete/timeout/error**：终态，触发清理
- **retry**：失败后可配置重试次数

**关键参数传递**：

| 参数来源 | 传递内容 | 映射目标 |
|----------|----------|----------|
| `config.json` → instructions | Agent 的持久化人设 | 容器内 system prompt |
| `config.json` → tools | 可用工具列表 | 容器内工具白名单 |
| `config.json` → resource_limits | CPU/内存/超时 | Docker `--cpus`/`--memory` |

**代码示例**：

```python
# Orchestrator 启动子 Agent
session_id = sessions_spawn(
    agent="reviewer",
    task="扫描 package.json 的依赖冲突",
    context={"repo_path": "/workspace", "branch": "main"}
)

# 异步查询状态
status = sessions_status(session_id)  # "running" | "complete" | "error"
```

### 2.2 sessions_send — 异步消息通信协议

**消息格式**（完整 JSON Schema）：

```json
{
  "from": "reviewer",
  "to": "devops",
  "type": "alert",
  "payload": {
    "message": "发现 express 路径遍历漏洞，建议暂停部署",
    "severity": "high",
    "cve": "CVE-2024-XXXX"
  },
  "timestamp": "2024-01-15T09:01:23Z",
  "correlation_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

| 字段 | 用途 |
|------|------|
| `from`/`to` | 发送方/接收方 Agent 名称 |
| `type` | 消息类型：`alert`/`info`/`request`/`response` |
| `payload` | 业务数据，结构自定义 |
| `correlation_id` | 链路追踪 ID，用于关联请求-响应 |

**路由机制**（4 步流程）：

1. 发送方调用 `sessions_send(to="devops", message="...")`
2. Gateway 查询 Agent 注册表，定位 devops 的活跃会话
3. 消息写入 devops 的输入队列（内存队列 + 磁盘持久化）
4. devops 的事件循环异步消费，按自身节奏处理

**非阻塞设计的工程意义**：

- 发送方调用后**立即返回**，不等待响应
- 接收方可能延迟数秒处理，不影响发送方继续工作
- 如需同步等待，需在 payload 中约定回调机制（如 `correlation_id` 匹配）

**消息持久化**：所有消息写入共享记忆的 `/messages` 目录，格式为 `{timestamp}_{from}_{to}.json`，支持审计、重放和故障恢复。

### 2.3 Heartbeat — 自主调度引擎

**触发机制**：

```
Heartbeat 守护进程（systemd/supervisor 管理）
    ↓ 每分钟检查
匹配 cron 表达式：0 9 * * * → 每天 09:00
    ↓ 匹配成功
触发任务 → spawn Orchestrator → Orchestrator 继续 spawn 子 Agent
```

**编排模式**：

```
Heartbeat 定时器
    ↓ 09:00 触发
Kev（Orchestrator）
    ↓ sessions_spawn
Reviewer + DevOps（并行执行）
    ↓ sessions_send
结果汇聚 → Kev 汇总 → 通知人类
```

**幂等性保障**：

- 每个任务记录 `last_triggered` 时间戳
- 同一分钟内**不重复触发**（防止分钟级抖动）
- 任务完成后更新时间戳

**任务配置详解**：

```json
{
  "heartbeat": {
    "enabled": true,
    "tasks": [
      {
        "agent": "reviewer",
        "trigger": "cron(0 9 * * *)",
        "action": "每日代码扫描",
        "timeout": "30m",
        "on_failure": "notify_orchestrator",
        "retry": { "max_attempts": 2, "delay": "5m" }
      },
      {
        "agent": "devops",
        "trigger": "cron(0 9,14,18 * * *)",
        "action": "系统健康检查"
      }
    ]
  }
}
```

| 字段 | 说明 |
|------|------|
| `trigger` | cron 表达式，支持标准 5 段格式 |
| `timeout` | 任务超时时间，超时后强制终止 |
| `on_failure` | 失败处理：`notify_orchestrator`/`retry`/`ignore` |
| `retry` | 重试策略：最大次数 + 重试间隔 |

---

## 三、集群配置：Agent 定义层完整解析

以下是可直接使用的完整配置：

```json
{
  "agents": {
    "defaults": {
      "model": { "primary": "glm-5" },
      "workspace": "/home/openclaw/workspace",
      "memory": {
        "type": "file",
        "path": "/home/openclaw/memory",
        "shared_scope": "cluster",
        "retention": { "working_memory": "24h", "long_term": "30d" },
        "indexing": { "enabled": true, "engine": "vector", "chunk_size": 512 }
      }
    },
    "subagents": {
      "kev": {
        "name": "Kev",
        "role": "orchestrator",
        "instructions": "你是 Kev，团队编排器。职责：1）接收任务并分解；2）通过 sessions_spawn 委派子 Agent；3）通过 sessions_list 监控状态；4）汇总结果向人类报告。你不亲自执行具体任务。",
        "tools": ["sessions_spawn", "sessions_send", "sessions_list"]
      },
      "reviewer": {
        "name": "Reviewer",
        "role": "specialist",
        "instructions": "你是 Reviewer，代码审计专家。扫描代码库，识别依赖冲突和安全隐患，生成评审报告写入共享记忆。发现关键问题时通过 sessions_send 通知相关 Agent。",
        "tools": ["file_read", "file_search", "shell_exec", "sessions_send"],
        "sandbox": "isolated"
      },
      "devops": {
        "name": "DevOps",
        "role": "specialist",
        "instructions": "你是 DevOps，运维专家。监控部署进度和系统状态，发现异常立即采取措施并向 Orchestrator 报告。",
        "tools": ["shell_exec", "file_read", "file_write", "sessions_send"],
        "sandbox": "isolated"
      }
    }
  }
}
```

**关键设计原则**：

| 设计点 | 原理 | 配置体现 |
|--------|------|----------|
| **角色分权** | orchestrator 可 spawn，specialist 不可 | Kev 有 `sessions_spawn`，Reviewer 没有 |
| **最小权限** | 只分配必需工具 | Reviewer 无 `file_write`（只读审计） |
| **共享记忆** | 跨 Agent 数据共享 | `shared_scope: "cluster"` |
| **沙盒隔离** | 子 Agent 在容器中执行 | `sandbox: "isolated"` |

---

## 四、安全与资源配置

**沙盒模式**：

```json
"sandbox": {
  "mode": "non-main",
  "resource_limits": {
    "cpu": "1 core",
    "memory": "512MB",
    "disk": "1GB",
    "network": "outbound_only",
    "timeout": "15m"
  }
}
```

| 模式 | 行为 | 适用场景 |
|------|------|----------|
| `off` | 所有 Agent 直接在宿主机执行 | 仅开发调试 |
| `non-main` | 子 Agent 在容器中，Orchestrator 保持宿主机访问 | **生产推荐** |
| `all` | 全部 Agent 容器化 | 最高安全级别 |

**resource_limits → Docker 参数映射**：

| 配置 | Docker 参数 | 作用 |
|------|-------------|------|
| `cpu: "1 core"` | `--cpus=1` | 限制 CPU 核数 |
| `memory: "512MB"` | `--memory=512m` | 限制内存上限 |
| `disk: "1GB"` | `--storage-opt size=1G` | 限制磁盘空间 |
| `timeout: "15m"` | 守护进程强制终止 | 防止死循环 |

**双层策略防御**：

```json
"policies": {
  "global": { "deny": ["rm -rf /", "sudo shutdown", "curl * | bash"] },
  "agent_overrides": {
    "reviewer": { "deny": ["file_write", "shell_exec --sudo"], "allow": ["file_read"] },
    "devops": { "deny": ["git push --force"], "allow": ["shell_exec", "docker *"] }
  }
}
```

- **global deny**：最后安全网，无论哪个 Agent 都禁止
- **agent_overrides**：细粒度控制，按 Agent 定制

---

## 五、编排与调度配置

```json
"orchestration": {
  "heartbeat": {
    "enabled": true,
    "tasks": [
      { "agent": "reviewer", "trigger": "cron(0 9 * * *)", "action": "每日代码扫描" },
      { "agent": "devops", "trigger": "cron(0 9,14,18 * * *)", "action": "系统健康检查" }
    ]
  },
  "sessions": {
    "max_concurrent": 10,
    "timeout": "15m",
    "on_timeout": "notify_orchestrator"
  }
}
```

**max_concurrent 计算公式**：

```
可用内存 = 总内存 - 系统预留(1GB) - Gateway 预留(512MB)
max_concurrent ≤ 可用内存 ÷ 单 Agent 内存(512MB)

示例：8GB 服务器
可用 = 8GB - 1GB - 0.5GB = 6.5GB
max_concurrent ≤ 6.5GB ÷ 512MB ≈ 13
```

---

## 六、运行时行为：涌现与协同

**涌现行为**——无需预编程的协同：

```
[09:00:00] Heartbeat 触发
           ↓
[09:00:02] Kev 执行 sessions_spawn("reviewer") + sessions_spawn("devops")
           ↓
           ├→ Reviewer 容器                    ├→ DevOps 容器
           │  shell_exec("npm audit")          │  检查部署状态
           │  发现 3 个依赖冲突                  │  发现进度落后 2 天
           │                                   │
           │  sessions_send → devops:           │  收到 Reviewer 告警
           │  "express 有漏洞，建议暂停部署"      │  → 自动暂停部署流程
           │                                   │
[09:01:30] Kev 收到汇报 → 读取共享记忆 → 生成简报 → 通知人类
```

这个协同流程**没有在任何地方硬编码**——Reviewer 主动通知 DevOps、DevOps 自主暂停部署，都是从各自的 instructions 和 sessions_send 能力中自然涌现。

**故障域隔离**：

- Agent A 崩溃 → 仅 A 的容器终止 → B、C 继续执行
- 死循环/资源耗尽 → timeout 强制终止 → 释放资源池
- 崩溃容器自动清理，不影响下次 spawn

---

## 七、调试与监控

```bash
# 查看 Agent 思考链（完整推理过程）
cat /home/openclaw/memory/reviewer/session_001.log

# 单 Agent 隔离测试（不启动完整集群）
openclaw agent run reviewer --task "扫描 package.json 的依赖冲突"

# 模拟 Agent 间通信
openclaw sessions send --from reviewer --to devops --message "测试消息"

# 查看所有 Agent 沙盒的资源占用
docker stats --no-stream
# CONTAINER    CPU %    MEM USAGE / LIMIT
# reviewer     12.3%    256MiB / 512MiB
# devops       8.7%     198MiB / 512MiB
```

---

## 延伸阅读

- [七牛云 MaaS 大模型服务](https://www.qiniu.com/products/maas) — 通过 MaaS API 统一接入 50+ 主流模型
- [OpenClaw 官方文档](https://github.com/openclaw/openclaw)
- [OpenClaw + 七牛云实战：从单体部署到集群编排](链接)
- [七牛云 LAS 全栈应用服务器产品文档](链接)
