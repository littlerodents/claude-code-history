import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from 'remotion';
import { QINIU_COLORS, commonStyles } from './styles';

// Logo 组件
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
          {name.charAt(0)}
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

// 连接线动画
const ConnectingLine: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div style={{
      width: 120,
      height: 4,
      background: 'rgba(255,255,255,0.3)',
      borderRadius: 2,
      overflow: 'hidden',
      margin: '0 20px',
    }}>
      <div style={{
        width: `${progress * 100}%`,
        height: '100%',
        background: QINIU_COLORS.white,
        borderRadius: 2,
        boxShadow: '0 0 20px rgba(255,255,255,0.8)',
      }} />
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

export const Scene2Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 产品列表
  const products = [
    { name: '七牛云 LAS', color: QINIU_COLORS.primary },
    { name: 'OpenClaw', color: '#10B981' },
    { name: '七牛云 MaaS', color: QINIU_COLORS.secondary },
  ];

  // 标题动画
  const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, fps * 0.5], [-50, 0], { extrapolateRight: 'clamp' });

  // 加号动画
  const plus1Opacity = interpolate(frame, [fps * 1.2, fps * 1.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const plus1Scale = spring({ frame: frame - fps * 1.2, fps, config: { damping: 10, stiffness: 120 } });

  const plus2Opacity = interpolate(frame, [fps * 2.0, fps * 2.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const plus2Scale = spring({ frame: frame - fps * 2.0, fps, config: { damping: 10, stiffness: 120 } });

  // 组合阶段
  const combineStart = fps * 4;
  const combineProgress = interpolate(
    frame,
    [combineStart, combineStart + fps * 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const productsOpacity = interpolate(
    frame,
    [combineStart, combineStart + fps * 0.5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const combinedOpacity = interpolate(
    frame,
    [combineStart + fps * 0.5, combineStart + fps * 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const combinedScale = spring({
    frame: frame - combineStart - fps * 0.5,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

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
        top: 100,
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
        <AbsoluteFill style={commonStyles.fullScreen}>
          <CombinedIcon
            opacity={combinedOpacity}
            scale={combinedScale}
          />
        </AbsoluteFill>
      )}

      {/* 副标题 */}
      <div style={{
        position: 'absolute',
        bottom: 150,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: subtitleOpacity,
      }}>
        <div style={{
          fontSize: 40,
          color: QINIU_COLORS.white,
          textShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}>
          24 小时监控余票，比手速？AI 没输过
        </div>
      </div>
    </AbsoluteFill>
  );
};
