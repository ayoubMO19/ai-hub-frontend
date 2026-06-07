import { useQuery } from '@tanstack/react-query'
import { getModels, getModelBySlug } from '@/api/models'
import type { Model, ModelFilters, PaginatedResponse } from '@/types'

interface UseModelsParams {
  filters?: Partial<ModelFilters>
  page?: number
  limit?: number
}

export function useModels({ filters, page = 1, limit = 20 }: UseModelsParams = {}) {
  return useQuery<PaginatedResponse<Model>>({
    queryKey: ['models', filters, page, limit],
    queryFn: () => getModels({ ...filters, page, limit }),
  })
}

export function useModel(slug: string, options?: { initialData?: Model }) {
  return useQuery<Model>({
    queryKey: ['model', slug],
    queryFn: () => getModelBySlug(slug),
    enabled: !!slug,
    initialData: options?.initialData,
  })
}
