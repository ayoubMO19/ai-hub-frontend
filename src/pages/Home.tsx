import { useState, useEffect, useMemo } from 'react'
import type { ModelFilters, RankingType } from '@/types'
import { formatPrice, formatContext } from '@/lib/utils'
import { useModels } from '@/hooks/useModels'
import { useAllRankings } from '@/hooks/useRankings'
import { useProviders } from '@/hooks/useProviders'
import StatCard from '@/components/ui/StatCard'
import FilterSidebar from '@/components/ui/FilterSidebar'
import ModelTable from '@/components/ui/ModelTable'

type SortBy = 'price-asc' | 'price-desc' | 'context' | 'name'

const MOCK_STATS = {
  totalModels: 847,
  totalProviders: 24,
  avgInputPrice: 2.34,
  freeModels: 127,
}

const rankingTabs: { type: RankingType; label: string }[] = [
  { type: 'cheapest', label: 'Cheapest' },
  { type: 'largest-context', label: 'Largest Context' },
  { type: 'fastest', label: 'Fastest' },
  { type: 'open-source', label: 'Open Source' },
  { type: 'multimodal', label: 'Multimodal' },
]

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

const sortOptions: { value: SortBy; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'context', label: 'Context Window' },
  { value: 'name', label: 'Name A-Z' },
]

const PAGE_SIZE = 20

function Home() {
  const [filters, setFilters] = useState<ModelFilters>({
    search: '',
    providers: [],
    isOpenSource: null,
    isMultimodal: null,
    minContext: null,
    maxPrice: null,
  })
  const [sortBy, setSortBy] = useState<SortBy>('price-asc')
  const [activeRanking, setActiveRanking] = useState<RankingType>('cheapest')
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [filters, sortBy])

  const { data: modelsPage, isLoading: modelsLoading, isError: modelsError } = useModels({
    filters,
    page,
    limit: PAGE_SIZE,
  })

  const { data: rankingsData, isLoading: rankingsLoading } = useAllRankings()
  const { data: providersData } = useProviders()

  const rawModels = modelsPage?.data ?? []
  const totalModels = modelsPage?.total ?? 0
  const totalPages = modelsPage?.totalPages ?? 1

  const models = useMemo(() => {
    const sorted = [...rawModels]
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.inputPricePerToken - b.inputPricePerToken)
      case 'price-desc':
        return sorted.sort((a, b) => b.inputPricePerToken - a.inputPricePerToken)
      case 'context':
        return sorted.sort((a, b) => b.contextWindow - a.contextWindow)
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return sorted
    }
  }, [rawModels, sortBy])

  const startItem = (page - 1) * PAGE_SIZE + 1
  const endItem = Math.min(page * PAGE_SIZE, totalModels)

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="flex flex-col items-center py-20 text-center">
        <h1 className="text-5xl font-bold text-text-primary">
          AI Models Hub
        </h1>
        <p className="mt-4 max-w-xl text-lg text-text-secondary">
          Explore <span className="font-semibold text-text-primary">{MOCK_STATS.totalModels}</span> AI models
          from <span className="font-semibold text-text-primary">{MOCK_STATS.totalProviders}</span> providers.
          Compare pricing, context windows, and capabilities.
        </p>
        <div className="mt-8 w-full max-w-lg">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
              placeholder="Search models by name, provider or keyword…"
              className="w-full rounded-xl border border-border bg-bg-secondary py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <StatCard value={MOCK_STATS.totalModels} label="Total Models" />
        <StatCard value={MOCK_STATS.totalProviders} label="Providers" />
        <StatCard value={MOCK_STATS.avgInputPrice} label="Avg. Input Price" suffix="$/M" />
        <StatCard value={MOCK_STATS.freeModels} label="Free Models" />
      </section>

      {/* ── Rankings ──────────────────────────────── */}
      <section id="rankings" className="mt-16">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-wrap justify-center gap-1 rounded-xl border border-border bg-bg-secondary p-1">
            {rankingTabs.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => setActiveRanking(type)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeRanking === type
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {rankingsLoading ? (
              <p className="py-8 text-center text-sm text-text-secondary">Loading rankings…</p>
            ) : Array.isArray(rankingsData?.[activeRanking]) && rankingsData[activeRanking].length > 0 ? (
              rankingsData[activeRanking].slice(0, 5).map((item) => (
                <div
                  key={item.rank}
                  className="group flex items-center gap-4 border-b border-border py-3 transition-colors hover:bg-bg-tertiary"
                >
                  <span className="w-8 text-center font-mono text-lg font-bold text-border-strong">
                    {item.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {item.model.name}
                    </p>
                    <p className="truncate text-xs text-text-secondary">
                      {item.model.provider.name}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-semibold text-accent">
                    {formatMetric(item.metricValue, activeRanking)}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-text-secondary">No rankings available.</p>
            )}
          </div>

          <div className="mt-6 text-center">
            <span className="cursor-pointer text-sm text-text-muted transition-colors hover:text-text-secondary">
              View all rankings →
            </span>
          </div>
        </div>
      </section>

      {/* ── Explorer ──────────────────────────────── */}
      <section id="models" className="mt-16">
        <div className="flex gap-6">
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              providers={providersData ?? []}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center justify-between px-4">
              <p className="text-sm text-text-secondary">
                {modelsError ? (
                  <span className="text-red-400">Failed to load models.</span>
                ) : (
                  <>
                    <span className="font-semibold text-text-primary">{totalModels}</span> models
                  </>
                )}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="rounded-lg border border-border bg-bg-secondary px-3 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {modelsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm text-text-secondary">Loading models…</p>
              </div>
            ) : modelsError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-medium text-text-primary">Failed to load models</p>
                <p className="mt-1 text-sm text-text-secondary">Try again.</p>
              </div>
            ) : models.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-medium text-text-primary">No models found</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Try adjusting your filters or search query.
                </p>
              </div>
            ) : (
              <>
                <ModelTable models={models} rankOffset={(page - 1) * PAGE_SIZE} />

                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-4">
                    <p className="text-sm text-text-secondary">
                      Showing <span className="font-medium text-text-primary">{startItem}–{endItem}</span> of{' '}
                      <span className="font-medium text-text-primary">{totalModels}</span> models
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
