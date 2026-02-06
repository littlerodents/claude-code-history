import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';
import { QINIU_COLORS, commonStyles } from './styles';

// ============================================
// 新增：私信福利列表组件
// ============================================
const BenefitItem: React.FC<{
  text: string;
  delay: number;
}> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [delay, delay + fps * 0.2],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const translateX = interpolate(
    frame,
    [delay, delay + fps * 0.3],
    [-30, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div style={{
      opacity,
      transform: `translateX(${translateX}px)`,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontSize: 28,
      color: QINIU_COLORS.white,
    }}>
      <span style={{
        color: '#10B981',
        fontSize: 32,
      }}>✓</span>
      {text}
    </div>
  );
};

// ============================================
// 原有组件（优化版）
// ============================================

// 评论气泡组件
const CommentBubble: React.FC<{
  text: string;
  delay: number;
  x: number;
  y: number;
}> = ({ text, delay, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [delay, delay + fps * 0.2],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  // 浮动效果
  const floatY = Math.sin((frame - delay) / 20) * 5;

  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      opacity,
      transform: `scale(${scale}) translateY(${floatY}px)`,
    }}>
      <div style={{
        background: QINIU_COLORS.white,
        borderRadius: 20,
        padding: '12px 24px',
        fontSize: 24,
        fontWeight: 'bold',
        color: QINIU_COLORS.primary,
        boxShadow: '0 8px 30px rgba(37, 99, 235, 0.3)',
        whiteSpace: 'nowrap',
      }}>
        {text}
      </div>
    </div>
  );
};

// 终端窗口组件
const TerminalWindow: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: '$ openclaw run ticket-bot', delay: 0 },
    { text: '🔍 正在监控余票...', delay: fps * 0.5 },
    { text: '🎫 发现余票！正在抢购...', delay: fps * 1 },
    { text: '✅ 抢票成功！订单号: 2025020112345', delay: fps * 1.5 },
  ];

  return (
    <div style={{
      width: 700,
      background: '#1a1a2e',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    }}>
      {/* 窗口标题栏 */}
      <div style={{
        background: '#2d2d44',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
        <div style={{
          marginLeft: 20,
          color: 'rgba(255,255,255,0.6)',
          fontSize: 14,
        }}>
          OpenClaw Terminal
        </div>
      </div>

      {/* 终端内容 */}
      <div style={{
        padding: 20,
        fontFamily: 'monospace',
        fontSize: 18,
        minHeight: 180,
      }}>
        {lines.map((line, i) => {
          const lineProgress = progress * fps * 2 - line.delay;
          if (lineProgress <= 0) return null;

          const lineOpacity = Math.min(lineProgress / (fps * 0.3), 1);
          const isSuccess = line.text.includes('✅');

          return (
            <div key={i} style={{
              color: isSuccess ? QINIU_COLORS.success : '#00ff88',
              marginBottom: 10,
              opacity: lineOpacity,
            }}>
              {line.text}
            </div>
          );
        })}

        {/* 光标 */}
        <div style={{
          display: 'inline-block',
          width: 10,
          height: 20,
          background: '#00ff88',
          opacity: Math.sin(frame / 15) > 0 ? 1 : 0,
        }} />
      </div>
    </div>
  );
};

// Logo 组件
const Logo: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => {
  const frame = useCurrentFrame();
  const glowIntensity = Math.sin(frame / 20) * 0.3 + 0.7;

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      display: 'flex',
      alignItems: 'center',
      gap: 20,
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 20,
        background: QINIU_COLORS.gradientPrimary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: `0 10px 40px rgba(37, 99, 235, ${glowIntensity})`,
      }}>
        <div style={{ fontSize: 40 }}>🦞</div>
      </div>
      <div style={{
        fontSize: 36,
        fontWeight: 'bold',
        color: QINIU_COLORS.white,
      }}>
        OpenClaw × 七牛云
      </div>
    </div>
  );
};

// ============================================
// 主组件
// ============================================

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 时间轴：
  // 0-0.5秒: 标题入场
  // 0.5-3.5秒: 终端窗口动画
  // 3.5-5秒: CTA + 私信福利列表
  // 5-8秒: 评论气泡 + Logo

  // 标题动画
  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // 终端窗口
  const terminalOpacity = interpolate(
    frame,
    [fps * 0.5, fps * 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const terminalProgress = interpolate(
    frame,
    [fps * 1, fps * 3.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 终端缩小上移
  const terminalMoveUp = interpolate(
    frame,
    [fps * 3.5, fps * 4],
    [0, -80],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const terminalShrink = interpolate(
    frame,
    [fps * 3.5, fps * 4],
    [1, 0.8],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // CTA 文字动画
  const ctaOpacity = interpolate(
    frame,
    [fps * 3.5, fps * 4],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const ctaY = interpolate(
    frame,
    [fps * 3.5, fps * 4],
    [30, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 私信福利列表开始时间
  const benefitStart = fps * 4.2;

  // 评论气泡数据（更多更密集）
  const comments = [
    { text: '抢票', x: 8, y: 20, delay: fps * 5 },
    { text: '抢票', x: 78, y: 15, delay: fps * 5.15 },
    { text: '抢票', x: 12, y: 55, delay: fps * 5.3 },
    { text: '抢票', x: 82, y: 50, delay: fps * 5.45 },
    { text: '抢票', x: 5, y: 38, delay: fps * 5.6 },
    { text: '抢票', x: 88, y: 32, delay: fps * 5.75 },
    { text: '抢票', x: 18, y: 72, delay: fps * 5.9 },
    { text: '抢票', x: 72, y: 68, delay: fps * 6.05 },
    { text: '抢票', x: 3, y: 82, delay: fps * 6.2 },
    { text: '抢票', x: 90, y: 78, delay: fps * 6.35 },
  ];

  // Logo 动画
  const logoOpacity = interpolate(
    frame,
    [fps * 6.5, fps * 7],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const logoScale = spring({
    frame: frame - fps * 6.5,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // 背景粒子
  const particles = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 137) % 100,
    y: (i * 89) % 100,
    size: 3 + (i % 4) * 2,
    speed: 0.3 + (i % 5) * 0.2,
  }));

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${QINIU_COLORS.primaryDark} 0%, ${QINIU_COLORS.primary} 100%)`,
    }}>
      {/* 背景粒子 */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${(p.y + frame * p.speed * 0.05) % 110 - 5}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
          }}
        />
      ))}

      {/* 评论气泡 */}
      {comments.map((comment, i) => (
        <CommentBubble
          key={i}
          text={comment.text}
          x={comment.x}
          y={comment.y}
          delay={comment.delay}
        />
      ))}

      {/* 主内容区 */}
      <AbsoluteFill style={{
        ...commonStyles.fullScreen,
        flexDirection: 'column',
        gap: 30,
      }}>
        {/* 标题 */}
        <div style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textAlign: 'center',
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
        }}>
          <div style={{
            ...commonStyles.title,
            fontSize: 52,
          }}>
            想要源码和保姆级教程？
          </div>
        </div>

        {/* 终端窗口 */}
        <div style={{
          opacity: terminalOpacity,
          transform: `translateY(${terminalMoveUp}px) scale(${terminalShrink})`,
          marginTop: 100,
        }}>
          <TerminalWindow progress={terminalProgress} />
        </div>

        {/* ========== 优化版 CTA ========== */}
        <div style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 80,
          marginTop: 20,
        }}>
          {/* 左侧：主 CTA */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 56,
              fontWeight: 'bold',
              color: QINIU_COLORS.white,
              marginBottom: 10,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>
              评论区扣【抢票】
            </div>
            <div style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.8)',
            }}>
              我私信发你 👇
            </div>
          </div>

          {/* 右侧：福利列表 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 16,
            padding: '20px 30px',
            backdropFilter: 'blur(10px)',
          }}>
            <BenefitItem text="完整源码" delay={benefitStart} />
            <BenefitItem text="保姆级部署教程" delay={benefitStart + fps * 0.15} />
            <BenefitItem text="1v1 答疑群" delay={benefitStart + fps * 0.3} />
          </div>
        </div>
      </AbsoluteFill>

      {/* Logo */}
      <div style={{
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Logo opacity={logoOpacity} scale={logoScale} />
      </div>
    </AbsoluteFill>
  );
};
