import { useState, useMemo, useEffect } from 'react'
import { MOCK_MODELS, MOCK_STATS, MOCK_RANKINGS, MOCK_PROVIDERS } from '@/data/mock'
import type { ModelFilters, RankingType } from '@/types'
import { formatPrice, formatContext } from '@/lib/utils'
import StatCard from '@/components/ui/StatCard'
import FilterSidebar from '@/components/ui/FilterSidebar'
import ModelTable from '@/components/ui/ModelTable'

type SortBy = 'price-asc' | 'price-desc' | 'context' | 'name'

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

  const filteredModels = useMemo(() => {
    let result = [...MOCK_MODELS]

    const q = filters.search.toLowerCase().trim()
    if (q) {
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.provider.name.toLowerCase().includes(q) ||
          (m.description ?? '').toLowerCase().includes(q),
      )
    }

    if (filters.providers.length > 0) {
      result = result.filter((m) => filters.providers.includes(m.provider.slug))
    }

    if (filters.isOpenSource === true) {
      result = result.filter((m) => m.isOpenSource)
    }

    if (filters.isMultimodal === true) {
      result = result.filter((m) => m.isMultimodal)
    }

    if (filters.minContext !== null) {
      result = result.filter((m) => m.contextWindow >= filters.minContext!)
    }

    if (filters.maxPrice !== null) {
      result = result.filter((m) => m.inputPricePerToken <= filters.maxPrice!)
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.inputPricePerToken - b.inputPricePerToken)
        break
      case 'price-desc':
        result.sort((a, b) => b.inputPricePerToken - a.inputPricePerToken)
        break
      case 'context':
        result.sort((a, b) => b.contextWindow - a.contextWindow)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [filters, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredModels.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedModels = filteredModels.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const startItem = (safePage - 1) * PAGE_SIZE + 1
  const endItem = Math.min(safePage * PAGE_SIZE, filteredModels.length)

  // Reset page when filters change
  useEffect(() => { setPage(1) }, [filters, sortBy])

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
          {/* Tabs */}
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

          {/* Ranking list */}
          <div className="mt-6">
            {MOCK_RANKINGS[activeRanking].map((item) => (
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
            ))}
          </div>

          {/* View all link */}
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
          {/* Sidebar — hidden on mobile */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              providers={MOCK_PROVIDERS}
            />
          </div>

          {/* Model list */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-2 flex items-center justify-between px-4">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-text-primary">{filteredModels.length}</span> models
                {filteredModels.length !== MOCK_MODELS.length && (
                  <span className="text-text-muted">
                    {' '}of {MOCK_MODELS.length}
                  </span>
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

            <ModelTable models={paginatedModels} rankOffset={(safePage - 1) * PAGE_SIZE} />

            {/* Pagination */}
            {filteredModels.length > PAGE_SIZE && (
              <div className="flex items-center justify-between px-4 py-4">
                <p className="text-sm text-text-secondary">
                  Showing <span className="font-medium text-text-primary">{startItem}–{endItem}</span> of{' '}
                  <span className="font-medium text-text-primary">{filteredModels.length}</span> models
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
