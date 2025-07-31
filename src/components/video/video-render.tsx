import { render } from "preact";
import { Video, VideoOptions } from "./video";
import { VastInformation } from "../../services/vast-model";

export const renderVideo = async (
  vastInformation: VastInformation,
  elementId: string,
  options: VideoOptions
) => {
  render(
    <Video options={options} vastInformation={vastInformation} />,
    document.getElementById(elementId)!
  );
};
