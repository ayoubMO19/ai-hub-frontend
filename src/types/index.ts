export interface Provider {
  id: string
  name: string
  slug: string
  description: string
  website: string
  logoUrl: string
}

export interface Model {
  id: string
  name: string
  slug: string
  description: string
  provider: Provider
  contextWindow: number
  inputPricePerToken: number
  outputPricePerToken: number
  isOpenSource: boolean
  isMultimodal: boolean
  speed: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
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
  score: number
  category: string
}
