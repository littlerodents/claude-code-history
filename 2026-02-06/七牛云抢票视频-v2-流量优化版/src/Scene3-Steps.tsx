import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';
import { QINIU_COLORS, commonStyles } from './styles';

// 步骤数据
const STEPS = [
  {
    number: 1,
    title: '一键部署',
    description: '七牛云 LAS 上一键给 AI 安个家，连服务器都不用自己搭',
    icon: '🚀',
    mockContent: 'console',
  },
  {
    number: 2,
    title: '导入技能包',
    description: '喂给 AI 一个"抢票技能包"，核心代码都封装好了',
    icon: '📦',
    mockContent: 'skill',
  },
  {
    number: 3,
    title: '绑定通知',
    description: '将 AI 链接到你的企业微信或邮箱',
    icon: '🔔',
    mockContent: 'notify',
  },
  {
    number: 4,
    title: '说人话下达指令',
    description: '告诉 AI 你要去哪，剩下的都交给它',
    icon: '💬',
    mockContent: 'chat',
  },
  {
    number: 5,
    title: '坐等通知付款',
    description: '接到 AI 抢票成功通知，登录账号去支付',
    icon: '✅',
    mockContent: 'payment',
  },
];

// 模拟控制台界面
const MockConsole: React.FC<{ progress: number }> = ({ progress }) => {
  const lines = [
    '$ qiniu las deploy openclaw',
    '正在初始化环境...',
    '正在拉取镜像...',
    '✓ 部署成功！',
  ];
  const visibleLines = Math.floor(progress * lines.length);

  return (
    <div style={{
      background: '#1a1a2e',
      borderRadius: 12,
      padding: 20,
      fontFamily: 'monospace',
      fontSize: 18,
      width: '100%',
      height: 200,
    }}>
      {lines.slice(0, visibleLines + 1).map((line, i) => (
        <div key={i} style={{
          color: line.startsWith('✓') ? QINIU_COLORS.success : '#00ff88',
          marginBottom: 8,
          opacity: i === visibleLines ? progress * lines.length - visibleLines : 1,
        }}>
          {line}
        </div>
      ))}
      <div style={{
        display: 'inline-block',
        width: 10,
        height: 20,
        background: '#00ff88',
        animation: 'blink 1s infinite',
      }} />
    </div>
  );
};

// 模拟技能导入界面
const MockSkillImport: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div style={{
      background: QINIU_COLORS.white,
      borderRadius: 12,
      padding: 20,
      width: '100%',
      height: 200,
    }}>
      <div style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: QINIU_COLORS.textPrimary,
        marginBottom: 15,
      }}>
        导入 Skill
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        padding: 15,
        background: QINIU_COLORS.background,
        borderRadius: 8,
        border: `2px solid ${progress > 0.5 ? QINIU_COLORS.success : QINIU_COLORS.primary}`,
      }}>
        <div style={{ fontSize: 32 }}>🎫</div>
        <div>
          <div style={{ fontWeight: 'bold', color: QINIU_COLORS.textPrimary }}>
            抢票技能包 v1.0
          </div>
          <div style={{ fontSize: 14, color: QINIU_COLORS.textSecondary }}>
            {progress > 0.5 ? '✓ 已导入' : '点击导入'}
          </div>
        </div>
      </div>
    </div>
  );
};

// 模拟通知绑定界面
const MockNotifySetup: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div style={{
      background: QINIU_COLORS.white,
      borderRadius: 12,
      padding: 20,
      width: '100%',
      height: 200,
    }}>
      <div style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: QINIU_COLORS.textPrimary,
        marginBottom: 15,
      }}>
        通知渠道设置
      </div>
      <div style={{ display: 'flex', gap: 15 }}>
        <div style={{
          flex: 1,
          padding: 15,
          background: progress > 0.3 ? '#e8f5e9' : QINIU_COLORS.background,
          borderRadius: 8,
          textAlign: 'center',
          border: progress > 0.3 ? `2px solid ${QINIU_COLORS.success}` : '2px solid transparent',
        }}>
          <div style={{ fontSize: 28 }}>💼</div>
          <div style={{ fontSize: 14, marginTop: 8 }}>企业微信</div>
          {progress > 0.3 && <div style={{ color: QINIU_COLORS.success, fontSize: 12 }}>✓ 已绑定</div>}
        </div>
        <div style={{
          flex: 1,
          padding: 15,
          background: progress > 0.6 ? '#e8f5e9' : QINIU_COLORS.background,
          borderRadius: 8,
          textAlign: 'center',
          border: progress > 0.6 ? `2px solid ${QINIU_COLORS.success}` : '2px solid transparent',
        }}>
          <div style={{ fontSize: 28 }}>📧</div>
          <div style={{ fontSize: 14, marginTop: 8 }}>邮箱</div>
          {progress > 0.6 && <div style={{ color: QINIU_COLORS.success, fontSize: 12 }}>✓ 已绑定</div>}
        </div>
      </div>
    </div>
  );
};

// 模拟聊天界面
const MockChat: React.FC<{ progress: number }> = ({ progress }) => {
  const messages = [
    { role: 'user', text: '帮我抢 2月1号 北京到上海的票' },
    { role: 'ai', text: '好的，已开始监控余票，有票会立即为您抢购' },
  ];

  return (
    <div style={{
      background: QINIU_COLORS.background,
      borderRadius: 12,
      padding: 20,
      width: '100%',
      height: 200,
      display: 'flex',
      flexDirection: 'column',
      gap: 15,
    }}>
      {messages.map((msg, i) => {
        const msgProgress = progress * 2 - i;
        if (msgProgress <= 0) return null;
        const opacity = Math.min(msgProgress, 1);

        return (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            opacity,
          }}>
            <div style={{
              background: msg.role === 'user' ? QINIU_COLORS.primary : QINIU_COLORS.white,
              color: msg.role === 'user' ? QINIU_COLORS.white : QINIU_COLORS.textPrimary,
              padding: '12px 18px',
              borderRadius: 16,
              maxWidth: '70%',
              fontSize: 16,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}>
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 模拟支付界面
const MockPayment: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div style={{
      background: QINIU_COLORS.white,
      borderRadius: 12,
      padding: 20,
      width: '100%',
      height: 200,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 15,
        marginBottom: 20,
      }}>
        <div style={{
          width: 50,
          height: 50,
          background: progress > 0.5 ? QINIU_COLORS.success : QINIU_COLORS.primary,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: QINIU_COLORS.white,
          fontSize: 24,
        }}>
          {progress > 0.5 ? '✓' : '🎫'}
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 18 }}>G1234 北京南 → 上海虹桥</div>
          <div style={{ color: QINIU_COLORS.textSecondary }}>2025-02-01 08:00 出发</div>
        </div>
      </div>
      <div style={{
        background: progress > 0.8 ? '#e8f5e9' : QINIU_COLORS.primary,
        color: progress > 0.8 ? QINIU_COLORS.success : QINIU_COLORS.white,
        padding: '15px 30px',
        borderRadius: 8,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
      }}>
        {progress > 0.8 ? '✓ 支付成功' : '立即支付 ¥553.00'}
      </div>
    </div>
  );
};

// 步骤卡片组件
const StepCard: React.FC<{
  step: typeof STEPS[0];
  isActive: boolean;
  progress: number;
  opacity: number;
  scale: number;
}> = ({ step, isActive, progress, opacity, scale }) => {
  const renderMockContent = () => {
    switch (step.mockContent) {
      case 'console':
        return <MockConsole progress={progress} />;
      case 'skill':
        return <MockSkillImport progress={progress} />;
      case 'notify':
        return <MockNotifySetup progress={progress} />;
      case 'chat':
        return <MockChat progress={progress} />;
      case 'payment':
        return <MockPayment progress={progress} />;
      default:
        return null;
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: 60,
      alignItems: 'center',
      opacity,
      transform: `scale(${scale})`,
    }}>
      {/* 左侧：步骤信息 */}
      <div style={{
        width: 500,
      }}>
        {/* 步骤编号 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 20,
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: isActive ? QINIU_COLORS.gradientPrimary : 'rgba(255,255,255,0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 36,
            fontWeight: 'bold',
            color: QINIU_COLORS.white,
            boxShadow: isActive ? '0 10px 30px rgba(37, 99, 235, 0.5)' : 'none',
          }}>
            {step.number}
          </div>
          <div style={{
            fontSize: 56,
          }}>
            {step.icon}
          </div>
        </div>

        {/* 标题 */}
        <div style={{
          fontSize: 48,
          fontWeight: 'bold',
          color: QINIU_COLORS.white,
          marginBottom: 15,
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          {step.title}
        </div>

        {/* 描述 */}
        <div style={{
          fontSize: 28,
          color: 'rgba(255,255,255,0.9)',
          lineHeight: 1.5,
        }}>
          {step.description}
        </div>
      </div>

      {/* 右侧：模拟界面 */}
      <div style={{
        width: 550,
        ...commonStyles.card,
        padding: 0,
        overflow: 'hidden',
      }}>
        {renderMockContent()}
      </div>
    </div>
  );
};

export const Scene3Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 每个步骤的持续时间 (25秒 / 5步骤 = 5秒每步)
  const stepDuration = fps * 5;
  const currentStep = Math.floor(frame / stepDuration);
  const stepProgress = (frame % stepDuration) / stepDuration;

  // 背景渐变
  const bgHue = 210 + currentStep * 5;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, hsl(${bgHue}, 70%, 45%) 0%, hsl(${bgHue + 15}, 60%, 55%) 100%)`,
    }}>
      {/* 顶部进度条 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 8,
        background: 'rgba(255,255,255,0.2)',
      }}>
        <div style={{
          width: `${((currentStep + stepProgress) / STEPS.length) * 100}%`,
          height: '100%',
          background: QINIU_COLORS.white,
          transition: 'width 0.1s',
        }} />
      </div>

      {/* 步骤指示器 */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 30,
      }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: i <= currentStep ? QINIU_COLORS.white : 'rgba(255,255,255,0.3)',
            color: i <= currentStep ? QINIU_COLORS.primary : 'rgba(255,255,255,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            transition: 'all 0.3s',
          }}>
            {i < currentStep ? '✓' : i + 1}
          </div>
        ))}
      </div>

      {/* 当前步骤内容 */}
      <AbsoluteFill style={commonStyles.fullScreen}>
        {STEPS.map((step, i) => {
          if (i !== currentStep || currentStep >= STEPS.length) return null;

          const enterProgress = interpolate(
            stepProgress,
            [0, 0.15],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );

          const contentProgress = interpolate(
            stepProgress,
            [0.15, 0.85],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const exitProgress = interpolate(
            stepProgress,
            [0.85, 1],
            [1, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const opacity = enterProgress * exitProgress;
          const scale = spring({
            frame: frame - i * stepDuration,
            fps,
            config: { damping: 15, stiffness: 80 },
          });

          return (
            <StepCard
              key={i}
              step={step}
              isActive={true}
              progress={contentProgress}
              opacity={opacity}
              scale={Math.min(scale, 1)}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
