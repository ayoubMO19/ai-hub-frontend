import { Link } from 'react-router-dom'
import { formatPrice, formatContext } from '@/lib/utils'
import type { RankingType } from '@/types'

interface RankingCardProps {
  rank: number
  name: string
  providerName: string
  metricValue: number
  type: RankingType
  slug: string
}

function formatMetric(value: number, type: RankingType): string {
  switch (type) {
    case 'cheapest':
      return formatPrice(value)
    case 'largest-context':
      return formatContext(value)
    case 'fastest':
      return 'Fast'
    case 'open-source':
      return formatContext(value)
    case 'multimodal':
      return formatPrice(value)
  }
}

function RankingCard({ rank, name, providerName, metricValue, type, slug }: RankingCardProps) {
  return (
    <Link
      to={`/models/${slug}`}
      className="flex w-64 shrink-0 flex-col gap-2 rounded-lg border border-border bg-bg-secondary p-4 transition-colors hover:border-accent"
    >
      <span className="font-mono text-5xl font-bold text-border-strong">
        {String(rank).padStart(2, '0')}
      </span>

      <div>
        <p className="text-sm font-medium text-text-primary">{name}</p>
        <p className="text-xs text-text-secondary">{providerName}</p>
      </div>

      <span className="font-mono text-lg font-semibold text-accent">
        {formatMetric(metricValue, type)}
      </span>
    </Link>
  )
}

export default RankingCard
