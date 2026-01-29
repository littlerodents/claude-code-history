import { Composition } from "remotion";
import { MoltbotVideo } from "./MoltbotVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MoltbotPromo"
        component={MoltbotVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
