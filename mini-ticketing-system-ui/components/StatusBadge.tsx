import { TicketStatus } from '@/types/ticket'

export default function StatusBadge({
  status
}: {
  status: TicketStatus
}) {

  const styles = {
    open: "bg-blue-100 text-blue-700",
    "in-progress": "bg-yellow-100 text-yellow-700",
    closed: "bg-green-100 text-green-700",
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  )
}