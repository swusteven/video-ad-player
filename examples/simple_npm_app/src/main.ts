import { criteoVideoPlayerFromContent } from "@criteo/video-player";
import "@criteo/video-player/dist/style.css";
import { vastContent } from "./vast_content";

criteoVideoPlayerFromContent(
  vastContent,
  "video-player-container",
  {
    altText: "Criteo Video Player",
    targetDimensions: {
      width: 720,
      height: 406
    },
    sessionClientUrl: "https://example.com/omid-session-client.js",
    omWebUrl: "https://example.com/omweb.js"
  }
);
