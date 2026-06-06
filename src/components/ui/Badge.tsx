interface BadgeProps {
  variant: 'openSource' | 'multimodal' | 'free' | 'default'
  size?: 'sm' | 'xs'
}

const variantStyles: Record<BadgeProps['variant'], { bg: string; text: string; border: string; label: string }> = {
  openSource: { bg: 'bg-green-900/50', text: 'text-green-400', border: 'border-green-500/30', label: 'Open Source' },
  multimodal: { bg: 'bg-blue-900/50', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Multimodal' },
  free: { bg: 'bg-emerald-900/50', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Free' },
  default: { bg: 'bg-gray-800', text: 'text-gray-400', border: 'border-gray-600', label: 'Default' },
}

function Badge({ variant, size = 'sm' }: BadgeProps) {
  const s = variantStyles[variant]
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-1.5 py-0.5 text-[10px]'

  return (
    <span className={`inline-block rounded-full border font-mono leading-none ${s.bg} ${s.text} ${s.border} ${sizeClass}`}>
      {s.label}
    </span>
  )
}

export default Badge
