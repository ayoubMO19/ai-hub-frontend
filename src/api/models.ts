import axiosInstance from '@/lib/axiosInstance'
import type { Model, ModelFilters, PaginatedResponse } from '@/types'

function cleanParams(params: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(params)) {
    if (val !== null && val !== undefined && val !== '') {
      result[key] = val
    }
  }
  return result
}

export type GetModelsParams = Partial<ModelFilters> & {
  page?: number
  limit?: number
}

export async function getModels(params?: GetModelsParams): Promise<PaginatedResponse<Model>> {
  const { providers, ...rest } = params || {}
  const query: Record<string, unknown> = { ...rest }
  if (providers && providers.length > 0) {
    query.provider = providers.join(',')
  }
  const { data } = await axiosInstance.get<PaginatedResponse<Model>>('/models', {
    params: cleanParams(query),
  })
  return data
}

export async function getModelBySlug(slug: string): Promise<Model> {
  const { data } = await axiosInstance.get<Model>(`/models/${slug}`)
  return data
}
