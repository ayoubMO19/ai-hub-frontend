import axiosInstance from '@/lib/axiosInstance'
import type { Model, PaginatedResponse } from '@/types'

export async function getModels(params?: Record<string, string>): Promise<PaginatedResponse<Model>> {
  const { data } = await axiosInstance.get<PaginatedResponse<Model>>('/models', { params })
  return data
}

export async function getModelBySlug(slug: string): Promise<Model> {
  const { data } = await axiosInstance.get<Model>(`/models/${slug}`)
  return data
}
