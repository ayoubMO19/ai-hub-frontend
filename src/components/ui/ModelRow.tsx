import { Link } from 'react-router-dom'
import type { Model } from '@/types'
import { formatPrice, formatContext, priceColorClass, formatSpeed } from '@/lib/utils'
import Badge from './Badge'

interface ModelRowProps {
  model: Model
  rank?: number
  isBookmarked?: boolean
  onBookmark?: (modelId: string) => void
}

const desktopGrid = 'grid-cols-[3rem_1fr_7rem_7rem_7rem_5rem_auto_2.5rem]'

function BookmarkBtn({ filled, onClick }: { filled: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick?.()
      }}
      className="flex items-center justify-center text-text-muted transition-colors hover:text-accent"
      aria-label={filled ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
    </button>
  )
}

function ModelRow({ model, rank, isBookmarked, onBookmark }: ModelRowProps) {
  return (
    <Link
      to={`/models/${model.slug}`}
      className="group border-b border-border transition-colors hover:bg-bg-tertiary"
    >
      {/* Mobile layout */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">{model.name}</p>
            <p className="truncate text-xs text-text-secondary">{model.provider.name}</p>
          </div>
          <span className={`shrink-0 font-mono text-sm ${priceColorClass(model.inputPricePer1M)}`}>
            {formatPrice(model.inputPricePer1M)}
          </span>
        </div>
        {onBookmark && (
          <BookmarkBtn filled={isBookmarked ?? false} onClick={() => onBookmark(model.id)} />
        )}
      </div>

      {/* Desktop layout */}
      <div className={`hidden items-center gap-4 px-4 py-3 lg:grid ${desktopGrid}`}>
        {rank !== undefined ? (
          <span className="text-center font-mono text-sm text-text-muted">{rank}</span>
        ) : (
          <span />
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text-primary">{model.name}</p>
          <p className="truncate text-xs text-text-secondary">{model.provider.name}</p>
        </div>

        <span className="font-mono text-sm text-text-secondary">
          {formatContext(model.contextWindow)}
        </span>

        <span className={`font-mono text-sm ${priceColorClass(model.inputPricePer1M)}`}>
          {formatPrice(model.inputPricePer1M)}
        </span>

        <span className="font-mono text-sm text-text-secondary">
          {formatPrice(model.outputPricePer1M)}
        </span>

        <span className="font-mono text-sm text-text-secondary">
          {formatSpeed(model.speedTokensPerSec)}
        </span>

        <div className="flex items-center gap-1.5">
          {model.inputPricePer1M === 0 && <Badge variant="free" />}
          {model.isOpenSource && <Badge variant="openSource" />}
          {model.isMultimodal && <Badge variant="multimodal" />}
        </div>

        <div className="flex justify-center">
          {onBookmark && (
            <BookmarkBtn filled={isBookmarked ?? false} onClick={() => onBookmark(model.id)} />
          )}
        </div>
      </div>
    </Link>
  )
}

export default ModelRow
