export function formatPrice(pricePerM: number): string {
  if (pricePerM === 0) return 'Free'
  return `$${pricePerM.toFixed(2)}/M`
}

export function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${tokens / 1_000_000}M`
  }
  return `${tokens / 1_000}K`
}

export function priceColorClass(pricePerM: number): string {
  if (pricePerM <= 1) return 'text-green-400'
  if (pricePerM <= 5) return 'text-text-primary'
  return 'text-orange-400'
}
