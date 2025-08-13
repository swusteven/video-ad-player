export type ClosedCaptionRenderProps = {
  isCcActive: boolean;
  content: string | null;
};

export function ClosedCaptionRender({
  isCcActive,
  content,
}: ClosedCaptionRenderProps) {
  return (
    <div
      class={`custom-subtitle-container ${isCcActive ? "active" : "disabled"}`}
    >
      {content}
    </div>
  );
}
