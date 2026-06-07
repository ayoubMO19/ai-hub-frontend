import { useNavigate } from 'react-router-dom'
import type { Model } from '@/types'
import { formatPrice, formatContext, priceColorClass, formatSpeed } from '@/lib/utils'
import Badge from './Badge'

interface ModelTableProps {
  models: Model[]
  rankOffset?: number
}

function ModelTable({ models, rankOffset = 0 }: ModelTableProps) {
  const navigate = useNavigate()

  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-text-primary">No models found</p>
        <p className="mt-1 text-sm text-text-secondary">
          Try adjusting your filters or search query.
        </p>
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="sticky top-14 z-10 border-b border-border bg-bg-secondary text-xs font-medium uppercase tracking-wider text-text-muted">
          <th className="hidden px-4 py-3 text-center font-mono md:table-cell md:w-12">#</th>
          <th className="px-4 py-3 text-left font-mono md:w-auto">Model</th>
          <th className="hidden px-4 py-3 text-right font-mono md:table-cell">Context</th>
          <th className="px-4 py-3 text-right font-mono">Input</th>
          <th className="hidden px-4 py-3 text-right font-mono lg:table-cell">Output</th>
          <th className="hidden px-4 py-3 text-center font-mono md:table-cell">Speed</th>
          <th className="hidden px-4 py-3 text-center font-mono md:table-cell">Type</th>
        </tr>
      </thead>
      <tbody>
        {models.map((model, i) => (
          <tr
            key={model.id}
            onClick={() => navigate(`/models/${model.slug}`)}
            className="cursor-pointer border-b border-border transition-colors hover:bg-bg-tertiary"
          >
            <td className="hidden px-4 py-3 text-center font-mono text-sm text-text-muted md:table-cell">
              {rankOffset + i + 1}
            </td>
            <td className="max-w-[200px] px-4 py-3 md:max-w-none">
              <p className="truncate text-sm font-medium text-text-primary">{model.name}</p>
              <p className="truncate text-xs text-text-secondary">{model.provider.name}</p>
            </td>
            <td className="hidden px-4 py-3 text-right font-mono text-sm text-text-secondary md:table-cell">
              {formatContext(model.contextWindow)}
            </td>
            <td className={`px-4 py-3 text-right font-mono text-sm ${priceColorClass(model.inputPricePer1M)}`}>
              {formatPrice(model.inputPricePer1M)}
            </td>
            <td className="hidden px-4 py-3 text-right font-mono text-sm text-text-secondary lg:table-cell">
              {formatPrice(model.outputPricePer1M)}
            </td>
            <td className="hidden px-4 py-3 text-center font-mono text-sm text-text-secondary md:table-cell">
              {formatSpeed(model.speedTokensPerSec)}
            </td>
            <td className="hidden px-4 py-3 md:table-cell">
              <div className="flex justify-center gap-1">
                {model.inputPricePer1M === 0 && <Badge variant="free" />}
                {model.isOpenSource && <Badge variant="openSource" />}
                {model.isMultimodal && <Badge variant="multimodal" />}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ModelTable
