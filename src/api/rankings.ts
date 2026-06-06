import axiosInstance from '@/lib/axiosInstance'
import type { RankingItem } from '@/types'

export async function getRanking(type: string): Promise<RankingItem[]> {
  const { data } = await axiosInstance.get<RankingItem[]>(`/rankings/${type}`)
  return data
}
