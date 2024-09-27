import { VastInformation } from '../vast-model';
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
export declare function setupAdVerification(vastInformation: VastInformation): Promise<AdVerification | null>;
export {};
