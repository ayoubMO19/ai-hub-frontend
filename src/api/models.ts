import axiosInstance from '@/lib/axiosInstance'
import type { Model, PaginatedResponse } from '@/types'

export interface GetModelsParams {
  search?: string
  provider?: string
  isOpenSource?: boolean
  isMultimodal?: boolean
  minContext?: number
  maxPrice?: number
  page?: number
  limit?: number
}

export async function getModels(params?: GetModelsParams): Promise<PaginatedResponse<Model>> {
  const { data } = await axiosInstance.get<PaginatedResponse<Model>>('/models', { params })
  return data
}

export async function getModelBySlug(slug: string): Promise<Model> {
  const { data } = await axiosInstance.get<Model>(`/models/${slug}`)
  return data
}
