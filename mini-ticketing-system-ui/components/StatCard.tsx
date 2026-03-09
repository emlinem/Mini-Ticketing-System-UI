type Props = {
  label: string
  value: number
  color?: string
}

export default function StatCard({
  label,
  value,
  color = "text-black"
}: Props) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <div className={`text-2xl font-bold ${color}`}>
        {value}
      </div>

      <div className="text-gray-500 text-sm">
        {label}
      </div>
    </div>
  )
}