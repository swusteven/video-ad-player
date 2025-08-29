import { VastInformation } from "../vast-model";
import { sendBeacon } from "../events-handler";

declare global {
  interface Window {
    OmidSessionClient?: any;
  }
}

export interface MediaEvents {
  pause: () => void;
  resume: () => void;
  volumeChange: (volume: number) => void;
  start: (duration: number, volume: number) => void;
  firstQuartile: () => void;
  midpoint: () => void;
  thirdQuartile: () => void;
  bufferStart: () => void;
  bufferFinish: () => void;
  complete: () => void;
}

interface AdVerification {
  onAdLoaded: () => void;
  setVideoContext: (video: HTMLVideoElement) => void;
  mediaEvents: MediaEvents;
}

export async function setupAdVerification(
  vastInformation: VastInformation,
  sessionClientUrl: string,
  omWebUrl: string,
): Promise<AdVerification | null> {
  if (vastInformation.adVerifications.length < 1) {
    console.log("No ad verifications found");
    return null;
  }

  if (sessionClientUrl === "" || omWebUrl === "") {
    console.log("Missing sessionClientUrl or omWebUrl. Abort loading OMID verification.");
    return null;
  }

  // Don't load the scripts twice if the user is requesting multiple videos
  if (!window.OmidSessionClient || !window.OmidSessionClient["default"]) {
    await initializeScripts(sessionClientUrl, omWebUrl);
  }

  if (!window.OmidSessionClient || !window.OmidSessionClient["default"]) {
    console.error("OMID Session Client not loaded");
    return null;
  }

  const sessionClient = window.OmidSessionClient["default"];

  const AdSession = sessionClient.AdSession;
  const Partner = sessionClient.Partner;
  const Context = sessionClient.Context;
  const VerificationScriptResource = sessionClient.VerificationScriptResource;
  const MediaEvents = sessionClient.MediaEvents;
  const AdEvents = sessionClient.AdEvents;
  const CONTENT_URL = window.location.href;
  const PARTNER_NAME = "criteo";
  // @ts-ignore
  const PARTNER_VERSION = Object.keys(window.OmidSessionClient)[0];
  const partner = new Partner(PARTNER_NAME, PARTNER_VERSION);
  const OMSDK_SERVICE_WINDOW = window.top;

  const resources = [];
  for (const verification of vastInformation.adVerifications) {
    /**
     * per the VAST spec we drop this if we do not load one of the possibly many verications
     * in the tag. From here we continue looping and add any valid verifications to be sent to omid context
     * see section 2.4.2 of the official spec https://iabtechlab.com/wp-content/uploads/2022/09/VAST_4.3.pdf
     */
    if (verification.apiFramework != "omid") {
      console.log(
        "detected non-omid compatible script, skipping load, attempting to fire verificationNotExecuted"
      );
      if (!vastInformation.beacons.verificationNotExecuted) {
        console.log("Failed to load verificationNotExecuted beacon");
        continue;
      }
      sendBeacon(vastInformation.beacons.verificationNotExecuted);
      console.log(
        vastInformation.beacons.verificationNotExecuted,
        "verificationNotExecuted beacon dropped"
      );
      continue;
    }
    resources.push(
      new VerificationScriptResource(
        verification.javascriptResource,
        verification.vendor,
        verification.verificationParameters,
        "full"
      )
    );
  }

  if (resources.length < 1) {
    console.log("no valid verification tags detected");
    return null;
  }

  const context = new Context(partner, resources, CONTENT_URL);
  context.setServiceWindow(OMSDK_SERVICE_WINDOW);
  const adSession = new AdSession(context);
  adSession.setCreativeType("video");

  // See impression type documentation to determine which type you should use.
  adSession.setImpressionType("beginToRender");

  if (!adSession.isSupported()) {
    console.log("This AdSession is not supported");
    return null;
  }

  const adEvents = new AdEvents(adSession);
  const VastProperties = sessionClient.VastProperties;
  const mediaEvents = new MediaEvents(adSession);
  adSession.start();

  const onAdLoaded = () => {
    adSession.registerSessionObserver((event: Event) => {
      if (event.type === "sessionStart") {
        const vastProperties = new VastProperties(false, 0, true, "standalone");

        //https://interactiveadvertisingbureau.github.io/Open-Measurement-SDKJS/#5-signal-ad-load-event
        adEvents.loaded(vastProperties);

        // https://interactiveadvertisingbureau.github.io/Open-Measurement-SDKJS/#6-signal-the-impression-event
        adEvents.impressionOccurred();
        console.log("OMID AdEvent loaded and impression occurred");
      }
    });
  };

  const setVideoContext = (videoElement: HTMLVideoElement) => {
    context.setVideoElement(videoElement);
  };

  return { onAdLoaded, mediaEvents, setVideoContext };
}

async function initializeScripts(sessionClientUrl: string, omWebUrl: string) {
  try {
    await loadScript(sessionClientUrl);
    await loadScript(omWebUrl);
  } catch (error) {
    console.error(error);
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(script);
  });
}
