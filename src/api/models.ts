import axiosInstance from '@/lib/axiosInstance'
import type { Model, ModelFilters, PaginatedResponse } from '@/types'
import { backendModelToModel } from '@/lib/transform'
import type { BackendModel } from '@/lib/transform'

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
  const { data } = await axiosInstance.get<{
    data: BackendModel[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>('/models', {
    params: cleanParams(query),
  })
  return {
    data: data.data.map(backendModelToModel),
    total: data.total,
    page: data.page,
    limit: data.limit,
    totalPages: data.totalPages,
  }
}

export async function getModelBySlug(slug: string): Promise<Model> {
  const { data } = await axiosInstance.get<BackendModel>(`/models/${slug}`)
  return backendModelToModel(data)
}
