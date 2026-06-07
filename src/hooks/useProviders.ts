import { useQuery } from '@tanstack/react-query'
import { getProviders } from '@/api/providers'
import type { Provider } from '@/types'

export function useProviders() {
  return useQuery<Provider[]>({
    queryKey: ['providers'],
    queryFn: getProviders,
    staleTime: 1000 * 60 * 60,
  })
}
