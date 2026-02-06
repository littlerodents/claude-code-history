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
// 新增：数据滚动组件
// ============================================
const RollingNumber: React.FC<{
  value: number;
  duration: number;
  startFrame: number;
  suffix?: string;
  prefix?: string;
}> = ({ value, duration, startFrame, suffix = '', prefix = '' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 缓动效果
  const easedProgress = 1 - Math.pow(1 - progress, 3);
  const displayValue = Math.floor(value * easedProgress);

  return (
    <span>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

// 数据卡片组件
const DataCard: React.FC<{
  icon: string;
  value: number;
  suffix: string;
  label: string;
  delay: number;
  color: string;
}> = ({ icon, value, suffix, label, delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [delay, delay + fps * 0.3],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const glow = Math.sin((frame - delay) / 15) * 0.2 + 0.8;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.15)',
      borderRadius: 16,
      padding: '20px 30px',
      textAlign: 'center',
      opacity,
      transform: `scale(${Math.min(scale, 1)})`,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: `0 10px 30px rgba(0,0,0,${glow * 0.2})`,
    }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontSize: 36,
        fontWeight: 'bold',
        color: color,
        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }}>
        <RollingNumber
          value={value}
          duration={fps * 1.5}
          startFrame={delay}
          suffix={suffix}
        />
      </div>
      <div style={{
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
      }}>
        {label}
      </div>
    </div>
  );
};

// ============================================
// 原有组件（保留）
// ============================================

// Logo 组件（小龙虾版）
const ProductLogo: React.FC<{
  name: string;
  color: string;
  delay: number;
  index: number;
}> = ({ name, color, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(
    frame,
    [delay, delay + fps * 0.3],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 浮动动画
  const floatY = Math.sin((frame + index * 30) / 30) * 8;

  // OpenClaw 用小龙虾 emoji
  const getIcon = (productName: string) => {
    if (productName === 'OpenClaw') return '🦞';
    return productName.charAt(0);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      opacity,
      transform: `scale(${appear}) translateY(${floatY}px)`,
    }}>
      {/* Logo 圆形 */}
      <div style={{
        width: 140,
        height: 140,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: `0 15px 40px ${color}66`,
        marginBottom: 20,
      }}>
        <div style={{
          fontSize: 48,
          fontWeight: 'bold',
          color: QINIU_COLORS.white,
        }}>
          {getIcon(name)}
        </div>
      </div>
      {/* 名称 */}
      <div style={{
        fontSize: 28,
        fontWeight: 'bold',
        color: QINIU_COLORS.white,
        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }}>
        {name}
      </div>
    </div>
  );
};

// 加号动画
const PlusSign: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => {
  return (
    <div style={{
      fontSize: 48,
      fontWeight: 'bold',
      color: QINIU_COLORS.white,
      opacity,
      transform: `scale(${scale})`,
      margin: '0 30px',
      textShadow: '0 0 20px rgba(255,255,255,0.5)',
    }}>
      +
    </div>
  );
};

// 组合图标动画
const CombinedIcon: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => {
  const frame = useCurrentFrame();
  const glowIntensity = Math.sin(frame / 15) * 0.3 + 0.7;

  return (
    <div style={{
      opacity,
      transform: `scale(${scale})`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        width: 180,
        height: 180,
        borderRadius: 30,
        background: `linear-gradient(135deg, ${QINIU_COLORS.primary} 0%, ${QINIU_COLORS.primaryLight} 100%)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: `0 20px 60px rgba(37, 99, 235, ${glowIntensity})`,
        border: '4px solid rgba(255,255,255,0.3)',
      }}>
        <div style={{
          fontSize: 64,
          color: QINIU_COLORS.white,
        }}>
          🤖
        </div>
      </div>
      <div style={{
        fontSize: 36,
        fontWeight: 'bold',
        color: QINIU_COLORS.white,
        marginTop: 25,
        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        AI 抢票神器
      </div>
    </div>
  );
};

// ============================================
// 主组件
// ============================================

export const Scene2Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 产品列表
  const products = [
    { name: '七牛云 LAS', color: QINIU_COLORS.primary },
    { name: 'OpenClaw', color: '#10B981' },
    { name: '七牛云 MaaS', color: QINIU_COLORS.secondary },
  ];

  // 时间轴调整：加入数据展示
  // 0-2秒: 标题
  // 0.5-3秒: 三个产品 Logo
  // 3-4.5秒: Logo 合并
  // 4.5-7秒: 数据卡片

  // 标题动画
  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, fps * 0.5], [-50, 0], { extrapolateRight: 'clamp' });

  // 加号动画
  const plus1Opacity = interpolate(frame, [fps * 1.2, fps * 1.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const plus1Scale = spring({ frame: frame - fps * 1.2, fps, config: { damping: 10, stiffness: 120 } });

  const plus2Opacity = interpolate(frame, [fps * 2.0, fps * 2.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const plus2Scale = spring({ frame: frame - fps * 2.0, fps, config: { damping: 10, stiffness: 120 } });

  // 组合阶段
  const combineStart = fps * 3;
  const productsOpacity = interpolate(
    frame,
    [combineStart, combineStart + fps * 0.5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const combinedOpacity = interpolate(
    frame,
    [combineStart + fps * 0.3, combineStart + fps * 0.8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const combinedScale = spring({
    frame: frame - combineStart - fps * 0.3,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // 数据卡片阶段
  const dataStart = fps * 4.5;
  const dataOpacity = interpolate(
    frame,
    [dataStart, dataStart + fps * 0.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 组合图标在数据阶段缩小上移
  const combinedMoveUp = interpolate(
    frame,
    [dataStart, dataStart + fps * 0.5],
    [0, -150],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const combinedShrink = interpolate(
    frame,
    [dataStart, dataStart + fps * 0.5],
    [1, 0.7],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 副标题动画
  const subtitleOpacity = interpolate(
    frame,
    [combineStart + fps * 1.5, combineStart + fps * 2],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 背景粒子效果
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: (i * 137) % 100,
    y: (i * 89) % 100,
    size: 4 + (i % 3) * 2,
    speed: 0.5 + (i % 4) * 0.3,
  }));

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${QINIU_COLORS.primaryDark} 0%, ${QINIU_COLORS.primary} 50%, ${QINIU_COLORS.primaryLight} 100%)`,
    }}>
      {/* 背景粒子 */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${(p.y + frame * p.speed * 0.1) % 120 - 10}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
          }}
        />
      ))}

      {/* 标题 */}
      <div style={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
      }}>
        <div style={{
          ...commonStyles.title,
          fontSize: 56,
        }}>
          三件套组合出击
        </div>
      </div>

      {/* 产品展示区域 */}
      <AbsoluteFill style={{
        ...commonStyles.fullScreen,
        opacity: productsOpacity,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {products.map((product, index) => (
            <React.Fragment key={product.name}>
              <ProductLogo
                name={product.name}
                color={product.color}
                delay={fps * (0.5 + index * 0.6)}
                index={index}
              />
              {index < products.length - 1 && (
                <PlusSign
                  opacity={index === 0 ? plus1Opacity : plus2Opacity}
                  scale={index === 0 ? plus1Scale : plus2Scale}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </AbsoluteFill>

      {/* 组合后的图标 */}
      {frame >= combineStart && (
        <AbsoluteFill style={{
          ...commonStyles.fullScreen,
          transform: `translateY(${combinedMoveUp}px) scale(${combinedShrink})`,
        }}>
          <CombinedIcon
            opacity={combinedOpacity}
            scale={Math.min(combinedScale, 1)}
          />
        </AbsoluteFill>
      )}

      {/* ========== 新增：数据卡片 ========== */}
      {frame >= dataStart && (
        <div style={{
          position: 'absolute',
          bottom: 180,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          opacity: dataOpacity,
        }}>
          <DataCard
            icon="👥"
            value={2847}
            suffix="+"
            label="已帮助用户"
            delay={dataStart}
            color="#10B981"
          />
          <DataCard
            icon="⚡"
            value={8}
            suffix="分钟"
            label="平均抢票时间"
            delay={dataStart + fps * 0.2}
            color="#F59E0B"
          />
          <DataCard
            icon="💰"
            value={200}
            suffix="+"
            label="节省黄牛费"
            delay={dataStart + fps * 0.4}
            color="#EF4444"
          />
        </div>
      )}

      {/* 副标题 */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: subtitleOpacity,
      }}>
        <div style={{
          fontSize: 32,
          color: 'rgba(255,255,255,0.9)',
          textShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}>
          24 小时监控余票，比手速？AI 没输过
        </div>
      </div>
    </AbsoluteFill>
  );
};
