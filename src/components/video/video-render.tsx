import { render } from "preact";
import { Video, VideoOptions } from "./video";
import { VastInformation } from "../../services/vast-model";

export const renderVideo = async (
  vastInformation: VastInformation,
  elementId: string,
  options: VideoOptions
) => {

  //Not to display a blank video and control element when media file or element ID is missing
  if (vastInformation.mediaFiles.length === 0 || !elementId) {
    console.warn("No media files found the VAST XML object or element ID is missing. Aborting Video rendering.");
    return null;
  }

  render(
    <Video options={options} vastInformation={vastInformation} />,
    document.getElementById(elementId)!
  );
};
