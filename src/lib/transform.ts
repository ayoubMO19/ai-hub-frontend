import type { Model } from '@/types'

export interface BackendModel {
  id: string
  slug: string
  name: string
  description?: string
  providerId: string
  inputPricePer1M: string
  outputPricePer1M: string
  contextWindow: number
  maxOutputTokens: number
  speedTokensPerSec: number | null
  isOpenSource: boolean
  isMultimodal: boolean
  isDeprecated: boolean
  isFeatured: boolean
  capabilities: string[]
  source: string
  createdAt: string
  updatedAt: string
  provider: {
    slug: string
    name: string
    website?: string | null
  }
}

export function backendModelToModel(b: BackendModel): Model {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    description: b.description,
    provider: {
      id: b.providerId,
      name: b.provider.name,
      slug: b.provider.slug,
      website: b.provider.website ?? undefined,
    },
    contextWindow: b.contextWindow,
    inputPricePerToken: parseFloat(b.inputPricePer1M),
    outputPricePerToken: parseFloat(b.outputPricePer1M),
    isOpenSource: b.isOpenSource,
    isMultimodal: b.isMultimodal,
    speed: b.speedTokensPerSec !== null
      ? b.speedTokensPerSec >= 50 ? 'fast' : b.speedTokensPerSec >= 20 ? 'medium' : 'slow'
      : undefined,
    createdAt: b.createdAt,
  }
}
