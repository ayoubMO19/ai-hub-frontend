import { useState, useMemo } from 'react'
import { MOCK_MODELS, MOCK_STATS, MOCK_RANKINGS, MOCK_PROVIDERS } from '@/data/mock'
import type { ModelFilters, RankingType } from '@/types'
import StatCard from '@/components/ui/StatCard'
import RankingCard from '@/components/ui/RankingCard'
import FilterSidebar from '@/components/ui/FilterSidebar'
import ModelRowHeader from '@/components/ui/ModelRowHeader'
import ModelRow from '@/components/ui/ModelRow'

type SortBy = 'price-asc' | 'price-desc' | 'context' | 'name'

const rankingSections: { type: RankingType; label: string; emoji: string }[] = [
  { type: 'cheapest', label: 'Cheapest Models', emoji: '💰' },
  { type: 'largest-context', label: 'Largest Context', emoji: '📖' },
  { type: 'fastest', label: 'Fastest Models', emoji: '⚡' },
  { type: 'open-source', label: 'Open Source', emoji: '🔓' },
  { type: 'multimodal', label: 'Multimodal', emoji: '🖼️' },
]

const sortOptions: { value: SortBy; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'context', label: 'Context Window' },
  { value: 'name', label: 'Name A-Z' },
]

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
      <section id="rankings" className="mt-16 space-y-10">
        {rankingSections.map(({ type, label, emoji }) => {
          const items = MOCK_RANKINGS[type]
          return (
            <div key={type}>
              <h2 className="mb-4 text-xl font-semibold text-text-primary">
                {emoji} {label}
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {items.map((item) => (
                  <RankingCard
                    key={item.rank}
                    rank={item.rank}
                    name={item.model.name}
                    providerName={item.model.provider.name}
                    metricValue={item.metricValue}
                    type={type}
                    slug={item.model.slug}
                  />
                ))}
              </div>
            </div>
          )
        })}
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

            {filteredModels.length > 0 ? (
              <>
                <ModelRowHeader />
                <div>
                  {filteredModels.map((model, i) => (
                    <ModelRow key={model.id} model={model} rank={i + 1} />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg font-medium text-text-primary">No models found</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
