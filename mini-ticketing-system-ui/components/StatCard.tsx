type Props = {
  label: string
  value: number
  color?: string
}

export default function StatCard({ label, value, color }: Props) {
  return (
    <div className="stat-card">
      {/* Value */}
      <div className={`text-2xl font-semibold ${color ?? "text-black"}`}>
        {value}
      </div>

      {/* Label */}
      <div className="text-gray-500 text-sm mt-1">
        {label}
      </div>
    </div>
  )
}