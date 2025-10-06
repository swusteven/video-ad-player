# Criteo Video Ad Integration Guide (Web)

## Purpose
This project helps you display video ads in web apps. It handles the technical details of parsing VAST ads and managing video playback, supports accessibility features such as keyboard navigation and closed captioning, and includes OMID integration for accurate ad viewability tracking according to industry standards.

Per Legal’s guidance, this project does not redistribute the Criteo-hosted OMSDK. Retailers must download and host their own instance of the OMSDK separately. 
See Step 4 in [Video Player Implementation (Desktop/Mobile)](https://developers.criteo.com/retailer-integration/docs/video-player-implementation-guide-desktopmobile#1-load-the-omid-service-script-and-session-client).
The project itself does not bundle or include our own OMSDK.

## Key Features 
This video player implementation fully adheres to [Criteo’s official video player specifications](https://developers.criteo.com/retailer-integration/docs/video-player-specifications), as demonstrated by the key features listed below:
- Public API for easy player bootstrap and integration  
- VAST ad parsing to extract media files, clickthroughs, tracking beacons, and ad verifications  
- Auto play/pause on scrolling & mute by default
- Automatic video selection to match target dimensions for optimal playback quality  
- Robust ad event handling with impression, click, and quartile tracking  
- OMID SDK integration for accurate viewability and engagement measurement  
- Closed caption support with precise WebVTT timing
- Lightweight inline SVG icons for UI elements  


## Tracking Events 
During the initial playback, the player automatically emits tracking beacons for the following events: impression, start, firstQuartile, midpoint, thirdQuartile, and complete. 
Additional events such as mute, unmute, pause, resume, and clickThrough are fired in response to user interactions.


## Main Components
**criteoVideoPlayerFromUrl**:  
This is the primary function you'll interact with. It serves as a complete wrapper that handles all aspects of video ad integration, from VAST parsing and asset downloading to OMID measurement and state management. It provides a simple API while managing the complex interactions between network requests, video playback, and ad tracking behind the scenes.

**criteoVideoPlayerFromContent**:  
Similar to `criteoVideoPlayerFromUrl`, but accepts a VAST XML string or object directly instead of fetching from a remote URL. Use this when you already have the VAST content available in your application.


## Demo

The `examples/` directory provides example implementations for both `criteoVideoPlayerFromUrl` and `criteoVideoPlayerFromContent`.

Check out the `README.md` file in each folder for installation instructions.



## Quick Start

Install **Criteo Video Player** from NPM:

```bash
npm i @criteo/video-player
```


## Vanilla JavaScript Example
This example demonstrates how to initialize the video ad player in a plain JavaScript environment, without any framework:

```js
import { criteoVideoPlayerFromUrl } from "@criteo/video-player";
import "@criteo/video-player/dist/style.css";

await criteoVideoPlayerFromUrl(
    "https://example.com/adtag.xml",
    "video-player-container",
    {
        sessionClientUrl: "https://example.com/omid-session-client.js",
        omWebUrl: "https://example.com/omweb.js",
        altText: "Criteo Video Player",
        targetDimensions: { width: 640, height: 360 },
    }
);
```


## React JavaScript Example
```js
import { criteoVideoPlayerFromUrl } from "@criteo/video-player";
import "@criteo/video-player/dist/style.css";

const CriteoVideo = ({vastUrl, elementId, options}) => {
  const containerRef = useRef(null);
  const idRef = useRef(elementId);

  useEffect(() => {
    if (!vastUrl || !containerRef.current) return;
    const currentEl = containerRef.current;

    criteoVideoPlayerFromUrl(
        vastUrl, 
        idRef.current, 
        {
            altText: "Criteo Video Player",
            ...(options || {}),
        }
    );

    return () => {
      if (currentEl) currentEl.replaceChildren();
    };
    
  }, [vastUrl, options]);

  return <div id={idRef.current} ref={containerRef} />;
};


const App = () => {
  return (
    <CriteoVideo
        vastUrl="https://example.com/adtag.xml"
        elementId="video-player-container"
        options={
            sessionClientUrl: "https://example.com/omid-session-client.js",
            omWebUrl: "https://example.com/omweb.js"
        }
    />
  );
};
```



