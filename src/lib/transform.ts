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
  sourceApiId: string
  syncedAt: string
  rawData?: Record<string, unknown>
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
    inputPricePer1M: parseFloat(b.inputPricePer1M),
    outputPricePer1M: parseFloat(b.outputPricePer1M),
    speedTokensPerSec: b.speedTokensPerSec,
    maxOutputTokens: b.maxOutputTokens,
    capabilities: b.capabilities,
    isOpenSource: b.isOpenSource,
    isMultimodal: b.isMultimodal,
    isDeprecated: b.isDeprecated,
    isFeatured: b.isFeatured,
    source: b.source,
    sourceApiId: b.sourceApiId,
    syncedAt: b.syncedAt,
    rawData: b.rawData,
    createdAt: b.createdAt,
  }
}
