type PixelBubbleProps = {
  icon: string
  label: string
}

export function PixelBubble({ icon, label }: PixelBubbleProps) {
  return (
    <span className="pixel-bubble">
      <span className="pixel-bubble__icon" aria-hidden="true">
        {icon}
      </span>
      <strong>{label}</strong>
    </span>
  )
}
