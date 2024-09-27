import { MediaEvents } from "./omid-js/omid-verification";
import { VastInformation } from "./vast-model";

export class EventsHandler {
  currentLoop = 1;
  adStartedSent = false;
  adFirstQuartileSent = false;
  adMidpointSent = false;
  adThirdQuartileSent = false;
  adCompletedSent = false;

  constructor(
    private readonly vastInformation: VastInformation,
    private readonly mediaEvents: MediaEvents | null
  ) {}

  setTime(currentTime: number, duration: number, volume: number) {
    const percent = (currentTime / duration) * 100;
    if (this.currentLoop != 1) {
      return;
    }
    if (percent >= 0.01 && !this.adStartedSent) {
      this.sendAdStarted(duration, volume);
    }
    if (percent >= 25 && !this.adFirstQuartileSent) {
      this.sendFirstQuartile();
    }
    if (percent >= 50 && !this.adMidpointSent) {
      this.sendMidpoint();
    }
    if (percent >= 75 && !this.adThirdQuartileSent) {
      this.sendThirdQuartile();
    }
  }

  loop() {
    if (this.currentLoop === 1) {
      sendBeacon(this.vastInformation.beacons.adCompleted);
      if (this.mediaEvents) {
        this.mediaEvents.complete();
      }
      this.adCompletedSent = true;
    }
    this.currentLoop++;
  }

  pause() {
    sendBeacon(this.vastInformation.beacons.pause);
    if (this.mediaEvents) {
      this.mediaEvents.pause();
    }
  }

  play() {
    sendBeacon(this.vastInformation.beacons.resume);
    if (this.mediaEvents) {
      this.mediaEvents.resume();
    }
  }

  mute() {
    sendBeacon(this.vastInformation.beacons.mute);
    if (this.mediaEvents) {
      this.mediaEvents.volumeChange(0);
    }
  }

  unmute(volume: number) {
    sendBeacon(this.vastInformation.beacons.unmute);
    if (this.mediaEvents) {
      this.mediaEvents.volumeChange(volume);
    }
  }

  bufferStart() {
    if (this.mediaEvents) {
      this.mediaEvents.bufferStart();
    }
  }

  bufferFinish() {
    if (this.mediaEvents) {
      this.mediaEvents.bufferFinish();
    }
  }

  private sendAdStarted(duration: number, volume: number) {
    sendBeacon(this.vastInformation.beacons.adStarted);
    if (this.mediaEvents) {
      this.mediaEvents.start(duration, volume);
    }
    this.adStartedSent = true;
  }

  private sendFirstQuartile() {
    sendBeacon(this.vastInformation.beacons.adFirstQuartile);
    if (this.mediaEvents) {
      this.mediaEvents.firstQuartile();
    }
    this.adFirstQuartileSent = true;
  }

  private sendMidpoint() {
    sendBeacon(this.vastInformation.beacons.adMidpoint);
    if (this.mediaEvents) {
      this.mediaEvents.midpoint();
    }
    this.adMidpointSent = true;
  }

  private sendThirdQuartile() {
    sendBeacon(this.vastInformation.beacons.adThirdQuartile);
    if (this.mediaEvents) {
      this.mediaEvents.thirdQuartile();
    }
    this.adThirdQuartileSent = true;
  }
}

export const sendBeacon = (beaconUrl: string | undefined) => {
  if (beaconUrl === undefined) {
    return;
  }
  try {
    const beacon = new URL(beaconUrl);
    navigator.sendBeacon(beacon);
  } catch (e) {
    console.error("Could not send beacon", e);
  }
};
