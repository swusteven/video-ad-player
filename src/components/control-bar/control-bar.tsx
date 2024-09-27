import { LowVolumeIcon } from "../icons/low-volume-icon";
import { MutedIcon } from "../icons/muted-icon";
import { PauseIcon } from "../icons/pause-icon";
import { PlayIcon } from "../icons/play-icon";

interface ControlBarProps {
  onClickMute: () => void;
  onClickPlayPause: () => void;
  isPlaying: boolean;
  isMuted: boolean;
}

export function ControlBar({
  onClickMute,
  onClickPlayPause,
  isMuted,
  isPlaying,
}: ControlBarProps) {
  return (
    <div class="rm-video-controls-container">
      <div class="controls">
        <div class="play-pause-container">
          <button
            class="play-pause-btn"
            onClick={onClickPlayPause}
            data-testid="play-button"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
        <div class="volume-container">
          <button
            class="mute-btn"
            onClick={onClickMute}
            data-testid="mute-button"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <LowVolumeIcon /> : <MutedIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}
