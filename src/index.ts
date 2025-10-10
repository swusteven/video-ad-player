import "./index.css";

import { VastParser } from "./services/vast-parser";
import { renderVideo } from "./components/video/video-render";
import { VideoOptions } from "./components/video/video";

/**
 * @param {string} vastUrl - The URL of the VAST XML file containing the video ad definition.
 * @param {string} elementId - The ID of the DOM element where the video player should be rendered. The element must exist in the DOM before calling this function.
 * @param {VideoOptions} options - Configuration object defining playback behavior, accessibility labels, fallback visuals, OMID session details, and target dimensions.
 */
export const criteoVideoPlayerFromUrl = async (
  vastUrl: string,
  elementId: string,
  options: VideoOptions
) => {
  const vastParser = new VastParser();
  const information = await vastParser.getFromUrl(vastUrl);
  return renderVideo(information, elementId, options);
};


/**
 * @param {string} vastContent - VAST XML string instead of fetching from a remote URL. Use this when you already have the VAST content available in your application
 * @param {string} elementId - The ID of the DOM element where the video player should be rendered. The element must exist in the DOM before calling this function.
 * @param {VideoOptions} options - Configuration object defining playback behavior, accessibility labels, fallback visuals, OMID session details, and target dimensions.
 */

export const criteoVideoPlayerFromContent = async (
  vastContent: string,
  elementId: string,
  options: VideoOptions
) => {
  const vastParser = new VastParser();
  const information = await vastParser.getFromContent(vastContent);
  return renderVideo(information, elementId, options);
};
