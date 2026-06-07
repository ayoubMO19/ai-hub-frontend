interface BadgeProps {
  variant: 'openSource' | 'multimodal' | 'free' | 'default'
}

const variantStyles: Record<BadgeProps['variant'], { classes: string; label: string }> = {
  openSource: { classes: 'text-green-400 border-green-400/20 bg-green-400/5', label: 'Open Source' },
  multimodal: { classes: 'text-blue-400 border-blue-400/20 bg-blue-400/5', label: 'Multimodal' },
  free: { classes: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5', label: 'Free' },
  default: { classes: 'text-gray-400 border-gray-400/20 bg-gray-400/5', label: 'Default' },
}

function Badge({ variant }: BadgeProps) {
  const s = variantStyles[variant]

  return (
    <span className={`inline-block rounded-sm border px-1.5 py-0.5 font-mono text-[10px] leading-none ${s.classes}`}>
      {s.label}
    </span>
  )
}

export default Badge
