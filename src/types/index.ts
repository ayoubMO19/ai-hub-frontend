export interface Provider {
  id: string
  name: string
  slug: string
  description?: string
  website?: string
  logoUrl?: string
  modelCount?: number
}

export interface Model {
  id: string
  name: string
  slug: string
  description?: string
  provider: Provider
  contextWindow: number
  inputPricePer1M: number
  outputPricePer1M: number
  speedTokensPerSec: number | null
  maxOutputTokens: number
  capabilities: string[]
  isOpenSource: boolean
  isMultimodal: boolean
  isDeprecated: boolean
  isFeatured: boolean
  source: string
  sourceApiId: string
  syncedAt: string
  rawData?: Record<string, unknown>
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface RankingItem {
  rank: number
  model: Model
  metricValue: number
  metricLabel: string
}

export interface ModelFilters {
  search: string
  providers: string[]
  isOpenSource: boolean | null
  isMultimodal: boolean | null
  minContext: number | null
  maxPrice: number | null
}

export type RankingType = 'cheapest' | 'largest-context' | 'fastest' | 'open-source' | 'multimodal'

export interface User {
  id: string
  email: string
  name: string
}
