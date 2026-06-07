import { useQuery } from '@tanstack/react-query'
import { getAllRankings, getRanking } from '@/api/rankings'
import type { RankingItem, RankingType } from '@/types'

export function useAllRankings() {
  return useQuery<Record<RankingType, RankingItem[]>>({
    queryKey: ['rankings'],
    queryFn: getAllRankings,
    staleTime: 1000 * 60 * 15,
  })
}

export function useRanking(type: RankingType) {
  return useQuery<RankingItem[]>({
    queryKey: ['ranking', type],
    queryFn: () => getRanking(type),
    staleTime: 1000 * 60 * 15,
  })
}
