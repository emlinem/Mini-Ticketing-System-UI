import { TicketStatus } from '@/types/ticket'
import { getStatusColor } from '@/utils/colorMappings'
import { formatStatus } from '@/utils/formatters'

type Props = {
  status: TicketStatus
}

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {formatStatus(status)}
    </span>
  )
}