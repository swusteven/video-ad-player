import { FallbackImageProps } from './components/video/video';
export declare const criteoVideoPlayerFromUrl: (vastUrl: string, elementId: string, altText: string, fallbackImage?: FallbackImageProps) => Promise<void>;
export declare const criteoVideoPlayerFromContent: (vastContent: string, elementId: string, altText: string, fallbackImage?: FallbackImageProps) => Promise<void>;
