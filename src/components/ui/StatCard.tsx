interface StatCardProps {
  value: string | number
  label: string
  suffix?: string
}

function StatCard({ value, label, suffix }: StatCardProps) {
  return (
    <div>
      <div className="font-mono text-4xl font-semibold text-text-primary">
        {value}
        {suffix && <span className="ml-1 text-lg text-text-muted">{suffix}</span>}
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-widest text-text-muted">
        {label}
      </p>
    </div>
  )
}

export default StatCard
