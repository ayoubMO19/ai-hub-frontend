import axiosInstance from '@/lib/axiosInstance'
import type { Provider } from '@/types'

export async function getProviders(): Promise<Provider[]> {
  const { data } = await axiosInstance.get<Provider[]>('/providers')
  return data
}

export async function getProviderBySlug(slug: string): Promise<Provider> {
  const { data } = await axiosInstance.get<Provider>(`/providers/${slug}`)
  return data
}
