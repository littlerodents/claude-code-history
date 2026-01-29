import { Series, AbsoluteFill } from "remotion";
import { Scene1iMessage } from "./scenes/Scene1-iMessage";
import { Scene2Memory } from "./scenes/Scene2-Memory";
import { Scene3OneClick } from "./scenes/Scene3-OneClick";
import { Scene4ModelMarket } from "./scenes/Scene4-ModelMarket";
import { Scene5CTA } from "./scenes/Scene5-CTA";
import { SCENE_DURATIONS, COLORS } from "./constants";

export const MoltbotVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.scene1}>
          <Scene1iMessage />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.scene2}>
          <Scene2Memory />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.scene3}>
          <Scene3OneClick />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.scene4}>
          <Scene4ModelMarket />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.scene5}>
          <Scene5CTA />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
