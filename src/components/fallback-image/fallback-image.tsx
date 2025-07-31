interface FallbackImageProps {
  fallbackImage: string;
  optionalVideoRedirectUrl: string;
  optionalRedirectTarget: string;
}

export function FallbackImage({
  fallbackImage,
  optionalVideoRedirectUrl,
  optionalRedirectTarget,
}: FallbackImageProps) {
  return (
    <a href={optionalVideoRedirectUrl} target={optionalRedirectTarget}>
      <img class="rm-video-fallback-image" src={fallbackImage} />
    </a>
  );
}
