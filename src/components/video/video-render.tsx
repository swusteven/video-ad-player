import { render } from "preact";
import { Video, VideoOptions } from "./video";
import { VastInformation } from "../../services/vast-model";

export const renderVideo = async (
  vastInformation: VastInformation,
  elementId: string,
  options: VideoOptions
) => {

  const targetElement = elementId
    ? document.getElementById(elementId)
    : null;

  if (!targetElement) {
    options.onError?.({
      source: "elementId",
      element: null,
      src: undefined,      
      message: `Target element with id "${elementId}" was not found in the DOM.`,
      nativeEvent: undefined,
    });
    console.warn("Element ID is missing or not found. Aborting Video rendering.");
    return null;
  }

  if (!vastInformation.mediaFiles.length) {
    options.onError?.({
      source: "vast",
      element: null,
      src: undefined,      
      message: "No media files found in the VAST XML object. Aborting Video rendering.",
      nativeEvent: undefined,
    });
    console.warn("No media files found in the VAST XML object. Aborting Video rendering.");
    return null;
  }

  render(
    <Video options={options} vastInformation={vastInformation} />,
    targetElement
  );
};
