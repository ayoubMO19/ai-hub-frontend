import axiosInstance from '@/lib/axiosInstance'
import type { RankingItem, RankingType } from '@/types'

export async function getAllRankings(): Promise<Record<RankingType, RankingItem[]>> {
  const { data } = await axiosInstance.get<Record<RankingType, RankingItem[]>>('/rankings')
  return data
}

export async function getRanking(type: RankingType): Promise<RankingItem[]> {
  const { data } = await axiosInstance.get<RankingItem[]>(`/rankings/${type}`)
  return data
}
