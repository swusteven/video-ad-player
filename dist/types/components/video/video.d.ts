import { VastInformation } from '../../services/vast-model';
export interface FallbackImageProps {
    src: string;
    optionalVideoRedirectUrl: string;
    optionalRedirectTarget: string;
}
interface VideoProps {
    fallbackImage?: FallbackImageProps;
    altText: string;
    vastInformation: VastInformation;
    maxVolume?: number;
}
export declare function Video(props: VideoProps): import("preact/compat").JSX.Element;
export {};
