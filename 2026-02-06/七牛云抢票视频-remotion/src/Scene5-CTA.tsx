import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';
import { QINIU_COLORS, commonStyles } from './styles';

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
        <div style={{ fontSize: 40 }}>🤖</div>
      </div>
      <div style={{
        fontSize: 36,
        fontWeight: 'bold',
        color: QINIU_COLORS.white,
      }}>
        OpenClaw
      </div>
    </div>
  );
};

export const Scene5CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
    [fps * 1, fps * 4],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // CTA 文字动画
  const ctaOpacity = interpolate(
    frame,
    [fps * 4, fps * 4.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const ctaY = interpolate(
    frame,
    [fps * 4, fps * 4.5],
    [30, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 评论气泡数据
  const comments = [
    { text: '抢票', x: 10, y: 25, delay: fps * 5 },
    { text: '抢票', x: 75, y: 20, delay: fps * 5.2 },
    { text: '抢票', x: 15, y: 65, delay: fps * 5.4 },
    { text: '抢票', x: 80, y: 60, delay: fps * 5.6 },
    { text: '抢票', x: 5, y: 45, delay: fps * 5.8 },
    { text: '抢票', x: 85, y: 40, delay: fps * 6 },
    { text: '抢票', x: 20, y: 80, delay: fps * 6.2 },
    { text: '抢票', x: 70, y: 75, delay: fps * 6.4 },
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
        gap: 40,
      }}>
        {/* 标题 */}
        <div style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textAlign: 'center',
        }}>
          <div style={{
            ...commonStyles.title,
            fontSize: 56,
            marginBottom: 15,
          }}>
            想要源码和保姆级教程？
          </div>
        </div>

        {/* 终端窗口 */}
        <div style={{ opacity: terminalOpacity }}>
          <TerminalWindow progress={terminalProgress} />
        </div>

        {/* CTA */}
        <div style={{
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: QINIU_COLORS.white,
            marginBottom: 15,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            评论区扣【抢票】
          </div>
          <div style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.9)',
          }}>
            带你用技术搞定回家路！
          </div>
        </div>

        {/* Logo */}
        <div style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Logo opacity={logoOpacity} scale={logoScale} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
