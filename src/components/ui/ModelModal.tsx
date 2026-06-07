import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Model } from '@/types'
import { formatPrice, formatContext, formatSpeed } from '@/lib/utils'
import Badge from './Badge'

interface ModelModalProps {
  model: Model
  onClose: () => void
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function ModelModal({ model, onClose }: ModelModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  const providerWebsite = model.provider.website

  const metrics = [
    { label: 'Input Price', value: formatPrice(model.inputPricePer1M) || '-' },
    { label: 'Output Price', value: formatPrice(model.outputPricePer1M) || '-' },
    { label: 'Context Window', value: formatContext(model.contextWindow) || '-' },
    { label: 'Max Output Tokens', value: model.maxOutputTokens?.toLocaleString() || '-' },
    { label: 'Speed', value: formatSpeed(model.speedTokensPerSec) },
    { label: 'Source', value: model.source || '-' },
  ]

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="relative w-full max-w-2xl rounded-xl border border-border bg-bg-primary shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="pr-8">
            <h2 className="text-xl font-bold text-text-primary">{model.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-border bg-bg-secondary px-2 py-0.5 text-xs font-medium text-text-secondary">
                {model.provider.name}
              </span>
              {model.isOpenSource && <Badge variant="openSource" />}
              {model.isMultimodal && <Badge variant="multimodal" />}
              {model.isFeatured && <Badge variant="featured" />}
            </div>
          </div>

          {/* Description */}
          {model.description && (
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              {model.description}
            </p>
          )}

          {/* Metrics grid */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-border bg-bg-secondary p-3">
                <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                  {m.label}
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-text-primary">
                  {m.value}
                </p>
              </div>
            ))}
          </div>

          {/* Capabilities */}
          {model.capabilities.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Capabilities
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {model.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="rounded-md border border-border bg-bg-secondary px-2 py-0.5 text-xs font-medium text-text-secondary"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <p className="mt-6 text-xs text-text-muted">
            Synced: {formatDate(model.syncedAt)}
          </p>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3">
            <button className="rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90">
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                Add to watchlist
              </span>
            </button>
            {providerWebsite && (
              <a
                href={providerWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
              >
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Provider site
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ModelModal
