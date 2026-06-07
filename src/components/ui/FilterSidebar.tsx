import { useState } from 'react'
import type { ModelFilters, Provider } from '@/types'

interface FilterSidebarProps {
  filters: ModelFilters
  onChange: (filters: ModelFilters) => void
  providers: Provider[]
}

const INITIAL_VISIBLE = 5

const contextOptions = [
  { label: 'Any', value: null },
  { label: '8K+', value: 8000 },
  { label: '32K+', value: 32000 },
  { label: '128K+', value: 128000 },
  { label: '1M+', value: 1000000 },
] as const

const priceOptions = [
  { label: 'Any', value: null },
  { label: 'Free', value: 0 },
  { label: '<$1', value: 1 },
  { label: '<$5', value: 5 },
  { label: '<$10', value: 10 },
] as const

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function FilterSidebar({ filters, onChange, providers }: FilterSidebarProps) {
  const [providersExpanded, setProvidersExpanded] = useState(false)
  const visibleProviders = providersExpanded ? providers : providers.slice(0, INITIAL_VISIBLE)
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-6 border-r border-border p-4">
      {/* Search */}
      <section>
        <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Search
        </label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search models..."
          className="mt-2 w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </section>

      <hr className="border-border" />

      {/* Provider */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Provider
        </h3>
        <div className="mt-2 space-y-1">
          {visibleProviders.map((p) => {
            const checked = filters.providers.includes(p.slug)
            return (
              <label key={p.id} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? filters.providers.filter((s) => s !== p.slug)
                      : [...filters.providers, p.slug]
                    onChange({ ...filters, providers: next })
                  }}
                  className="peer sr-only"
                />
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-transparent transition-colors peer-checked:border-accent peer-checked:bg-accent">
                  {checked && <CheckIcon />}
                </div>
                <span className="text-sm text-text-primary">{p.name}</span>
              </label>
            )
          })}
          {providers.length > INITIAL_VISIBLE && (
            <button
              onClick={() => setProvidersExpanded((e) => !e)}
              className="mt-1 text-xs font-medium text-accent hover:underline"
            >
              {providersExpanded ? 'Show less' : `Show more (${providers.length - INITIAL_VISIBLE} more)`}
            </button>
          )}
        </div>
      </section>

      <hr className="border-border" />

      {/* Type toggles */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Type
        </h3>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() =>
              onChange({
                ...filters,
                isOpenSource: filters.isOpenSource === true ? null : true,
              })
            }
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filters.isOpenSource === true
                ? 'bg-accent text-white'
                : 'border border-border text-text-secondary hover:border-accent'
            }`}
          >
            Open Source
          </button>
          <button
            onClick={() =>
              onChange({
                ...filters,
                isMultimodal: filters.isMultimodal === true ? null : true,
              })
            }
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filters.isMultimodal === true
                ? 'bg-accent text-white'
                : 'border border-border text-text-secondary hover:border-accent'
            }`}
          >
            Multimodal
          </button>
        </div>
      </section>

      <hr className="border-border" />

      {/* Context Window */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Context Window
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {contextOptions.map((opt) => {
            const active = filters.minContext === opt.value
            return (
              <button
                key={opt.label}
                onClick={() => onChange({ ...filters, minContext: opt.value })}
                className={`rounded-lg px-3 py-1.5 font-mono text-sm font-medium transition-colors ${
                  active
                    ? 'bg-accent text-white'
                    : 'border border-border text-text-secondary hover:border-accent'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </section>

      <hr className="border-border" />

      {/* Max Price */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Max Price
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {priceOptions.map((opt) => {
            const active = filters.maxPrice === opt.value
            return (
              <button
                key={opt.label}
                onClick={() => onChange({ ...filters, maxPrice: opt.value })}
                className={`rounded-lg px-3 py-1.5 font-mono text-sm font-medium transition-colors ${
                  active
                    ? 'bg-accent text-white'
                    : 'border border-border text-text-secondary hover:border-accent'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </section>
    </aside>
  )
}

export default FilterSidebar
