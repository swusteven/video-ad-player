interface ControlBarProps {
    onClickMute: () => void;
    onClickPlayPause: () => void;
    isPlaying: boolean;
    isMuted: boolean;
}
export declare function ControlBar({ onClickMute, onClickPlayPause, isMuted, isPlaying, }: ControlBarProps): import("preact").JSX.Element;
export {};
