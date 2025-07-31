import { FallbackImageProps } from './video';
import { VastInformation } from '../../services/vast-model';
export declare const renderVideo: (vastInformation: VastInformation, elementId: string, altText: string, fallbackImage?: FallbackImageProps) => Promise<void>;
