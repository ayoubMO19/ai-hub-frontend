import axiosInstance from '@/lib/axiosInstance'
import type { RankingItem, RankingType } from '@/types'
import { backendModelToModel } from '@/lib/transform'
import type { BackendModel } from '@/lib/transform'

interface BackendRankingResponse {
  ranking: string
  total: number
  models: BackendModel[]
}

function computeRankingItems(models: BackendModel[], type: RankingType): RankingItem[] {
  return models.map((m, i) => ({
    rank: i + 1,
    model: backendModelToModel(m),
    metricValue: computeMetricValue(m, type),
    metricLabel: computeMetricLabel(type),
  }))
}

function computeMetricValue(m: BackendModel, type: RankingType): number {
  switch (type) {
    case 'cheapest':
    case 'multimodal':
      return parseFloat(m.inputPricePer1M)
    case 'largest-context':
    case 'open-source':
      return m.contextWindow
    case 'fastest':
      return m.speedTokensPerSec ?? 0
  }
}

function computeMetricLabel(type: RankingType): string {
  switch (type) {
    case 'cheapest':
      return 'Input Price'
    case 'largest-context':
      return 'Context Window'
    case 'fastest':
      return 'Tokens/s'
    case 'open-source':
      return 'Context Window'
    case 'multimodal':
      return 'Input Price'
  }
}

export async function getAllRankings(): Promise<Record<RankingType, RankingItem[]>> {
  const { data } = await axiosInstance.get<Record<string, BackendRankingResponse>>('/rankings')
  const result = {} as Record<RankingType, RankingItem[]>
  for (const [, ranking] of Object.entries(data)) {
    const type = ranking.ranking as RankingType
    result[type] = computeRankingItems(ranking.models, type)
  }
  return result
}

export async function getRanking(type: RankingType): Promise<RankingItem[]> {
  const { data } = await axiosInstance.get<BackendRankingResponse>(`/rankings/${type}`)
  return computeRankingItems(data.models, type)
}
