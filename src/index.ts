import "./index.css";

import { VastParser } from "./services/vast-parser";
import { renderVideo } from "./components/video/video-render";
import { VideoOptions } from "./components/video/video";


export const criteoVideoPlayerFromUrl = async (
  vastUrl: string,
  elementId: string,
  options: VideoOptions
) => {
  const vastParser = new VastParser();
  const information = await vastParser.getFromUrl(vastUrl);
  return renderVideo(information, elementId, options);
};

export const criteoVideoPlayerFromContent = async (
  vastContent: string,
  elementId: string,
  options: VideoOptions
) => {
  const vastParser = new VastParser();
  const information = await vastParser.getFromContent(vastContent);
  return renderVideo(information, elementId, options);
};


export type { VastInformation } from "./services/vast-model";
export type { VideoOptions };
export { Video } from "./components/video/video";
export { VastParser }