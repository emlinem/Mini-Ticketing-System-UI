import { Ticket, TicketStatus } from "@/types/ticket"
import StatusBadge from "./StatusBadge"

type Props = {
  tickets: Ticket[]
  onStatusChange?: (id: string, status: TicketStatus) => void
}

export default function TicketList({ tickets, onStatusChange }: Props) {
  // Empty state
  if (tickets.length === 0) {
    return <p className="text-gray-500">No tickets yet.</p>
  }

  return (
    <div className="space-y-6">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="ticket-card">
          {/* Ticket info */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">{ticket.title}</h3>
            <p className="text-gray-600 text-sm">{ticket.description}</p>
          </div>

          {/* Status section */}
          <div className="flex flex-col items-end gap-3">
            <StatusBadge status={ticket.status} />

            <select
              value={ticket.status}
              onChange={(e) =>
                onStatusChange?.(ticket.id, e.target.value as TicketStatus)
              }
              className="select-field"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}