import { MediaEvents } from './omid-js/omid-verification';
import { VastInformation } from './vast-model';
export declare class EventsHandler {
    private readonly vastInformation;
    private readonly mediaEvents;
    currentLoop: number;
    adStartedSent: boolean;
    adFirstQuartileSent: boolean;
    adMidpointSent: boolean;
    adThirdQuartileSent: boolean;
    adCompletedSent: boolean;
    constructor(vastInformation: VastInformation, mediaEvents: MediaEvents | null);
    setTime(currentTime: number, duration: number, volume: number): void;
    loop(): void;
    pause(): void;
    play(): void;
    mute(): void;
    unmute(volume: number): void;
    bufferStart(): void;
    bufferFinish(): void;
    private sendAdStarted;
    private sendFirstQuartile;
    private sendMidpoint;
    private sendThirdQuartile;
}
export declare const sendBeacon: (beaconUrl: string | undefined) => void;
