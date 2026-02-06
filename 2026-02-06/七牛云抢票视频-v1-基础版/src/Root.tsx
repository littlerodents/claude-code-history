import React from 'react';
import { Composition, Sequence } from 'remotion';
import { Scene1Hook } from './Scene1-Hook';
import { Scene2Solution } from './Scene2-Solution';
import { Scene3Steps } from './Scene3-Steps';
import { Scene4Ad } from './Scene4-Ad';
import { Scene5CTA } from './Scene5-CTA';
import { VIDEO_CONFIG, getSceneFrames } from './styles';

// 主视频组件
export const QiniuTicketVideo: React.FC = () => {
  const scene1 = getSceneFrames('scene1');
  const scene2 = getSceneFrames('scene2');
  const scene3 = getSceneFrames('scene3');
  const scene4 = getSceneFrames('scene4');
  const scene5 = getSceneFrames('scene5');

  return (
    <>
      {/* Scene 1: 开头钩子 (0-8秒) */}
      <Sequence from={scene1.start} durationInFrames={scene1.duration}>
        <Scene1Hook />
      </Sequence>

      {/* Scene 2: 解决方案 (8-15秒) */}
      <Sequence from={scene2.start} durationInFrames={scene2.duration}>
        <Scene2Solution />
      </Sequence>

      {/* Scene 3: 操作步骤 (15-40秒) */}
      <Sequence from={scene3.start} durationInFrames={scene3.duration}>
        <Scene3Steps />
      </Sequence>

      {/* Scene 4: 广告植入 (40-52秒) */}
      <Sequence from={scene4.start} durationInFrames={scene4.duration}>
        <Scene4Ad />
      </Sequence>

      {/* Scene 5: 结尾CTA (52-60秒) */}
      <Sequence from={scene5.start} durationInFrames={scene5.duration}>
        <Scene5CTA />
      </Sequence>
    </>
  );
};

// Remotion Root 组件
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 完整视频 */}
      <Composition
        id="QiniuTicket"
        component={QiniuTicketVideo}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      {/* 单独预览各场景 */}
      <Composition
        id="Scene1-Hook"
        component={Scene1Hook}
        durationInFrames={getSceneFrames('scene1').duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      <Composition
        id="Scene2-Solution"
        component={Scene2Solution}
        durationInFrames={getSceneFrames('scene2').duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      <Composition
        id="Scene3-Steps"
        component={Scene3Steps}
        durationInFrames={getSceneFrames('scene3').duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      <Composition
        id="Scene4-Ad"
        component={Scene4Ad}
        durationInFrames={getSceneFrames('scene4').duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      <Composition
        id="Scene5-CTA"
        component={Scene5CTA}
        durationInFrames={getSceneFrames('scene5').duration}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
    </>
  );
};
