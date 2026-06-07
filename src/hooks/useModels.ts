import { useQuery } from '@tanstack/react-query'
import { getModels, getModelBySlug } from '@/api/models'
import type { Model, ModelFilters, PaginatedResponse } from '@/types'

interface UseModelsParams {
  filters?: Partial<ModelFilters>
  page?: number
  limit?: number
  sortBy?: string
}

export function useModels({ filters, page = 1, limit = 20, sortBy }: UseModelsParams = {}) {
  return useQuery<PaginatedResponse<Model>>({
    queryKey: ['models', filters, page, limit, sortBy],
    queryFn: () => getModels({ ...filters, page, limit, sortBy }),
  })
}

export function useModel(slug: string) {
  return useQuery<Model>({
    queryKey: ['model', slug],
    queryFn: () => getModelBySlug(slug),
    enabled: !!slug,
  })
}
