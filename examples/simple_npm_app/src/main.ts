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
    sessionClientUrl: "https://static.criteo.net/banners/js/omidjs/stable/omid-session-client-v1.js",
    omWebUrl: "https://static.criteo.net/banners/js/omidjs/stable/omweb-v1.js"
  }
);
