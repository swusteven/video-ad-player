export interface VastInformation {
  mediaUrl: string | undefined;
  clickThroughUrl: string | undefined;
  beacons: Beacons;
  adVerifications: AdVerification[];
}

export interface Beacons {
  impression: string | undefined;
  adStarted: string | undefined;
  adFirstQuartile: string | undefined;
  adMidpoint: string | undefined;
  adThirdQuartile: string | undefined;
  adCompleted: string | undefined;
  mute: string | undefined;
  unmute: string | undefined;
  pause: string | undefined;
  resume: string | undefined;
  clickThrough: string | undefined;
  verificationNotExecuted: string | undefined;
}

export interface AdVerification {
  javascriptResource: string | undefined;
  apiFramework: string | undefined;
  vendor: string | undefined;
  verificationParameters: string | undefined;
}
