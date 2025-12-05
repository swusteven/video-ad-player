import "./index.css";

import { VastParser } from "./services/vast-parser";
import { renderVideo } from "./components/video/video-render";
import { VideoOptions } from "./components/video/video";

/**
 * @param {string} vastUrl - The URL of the VAST XML file containing the video ad definition.
 * @param {string} elementId - The ID of the DOM element where the video player should be rendered. The element must exist in the DOM before calling this function.
 * @param {VideoOptions} options - Configuration object defining playback behavior, accessibility labels, OMID session details, target dimensions, onError callback.
 */
export const criteoVideoPlayerFromUrl = async (
  vastUrl: string,
  elementId: string,
  options: VideoOptions
) => {
  try {
    const vastParser = new VastParser();
    const information = await vastParser.getFromUrl(vastUrl, options);
    return renderVideo(information, elementId, options);
  } catch (e) {
    if (!options.onError) {
      console.error("Failed to load or parse VAST", e);
    }
    return null;
  }
};


/**
 * @param {string} vastContent - VAST XML string instead of fetching from a remote URL. Use this when you already have the VAST content available in your application
 * @param {string} elementId - The ID of the DOM element where the video player should be rendered. The element must exist in the DOM before calling this function.
 * @param {VideoOptions} options - Configuration object defining playback behavior, accessibility labels, OMID session details, target dimensions, and onError callback.
 */

export const criteoVideoPlayerFromContent = async (
  vastContent: string,
  elementId: string,
  options: VideoOptions
) => {  
  try {
    const vastParser = new VastParser()
    const information = vastParser.getFromContent(vastContent, options);
    return renderVideo(information, elementId, options);
  } catch (e) {    
    if (!options.onError) {
      console.error("Failed to parse VAST content", e);
    }
    return null;
  }
};
