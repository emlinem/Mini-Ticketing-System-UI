import {Ticket, TicketStatus} from "@/types/ticket"
import StatusBadge from "./StatusBadge"

type Props = {
  tickets: Ticket[]
  onStatusChange?: (id: string, status: TicketStatus) => void
}

export default function TicketList({ tickets, onStatusChange }: Props) {
    if (tickets.length === 0) {
        return <p className="text-gray-500 ">No tickets yet.</p>
    }

    return(
        <div className="space-y-3">
            {tickets.map((ticket) => (
                <div
                    key={ticket.id}
                    className="bg-white border rounded-xl p-5 shadow-sm flex justify-between"
                >
                <div>
                    <h3 className="font-semibold text-lg">
                    {ticket.title}
                    </h3>

                    <p className="text-gray-600 mt-1">
                    {ticket.description}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">

                    <StatusBadge status={ticket.status} />

                    <select
                    value={ticket.status}
                    onChange={(e) =>
                        onStatusChange?.(ticket.id, e.target.value as TicketStatus)
                    }
                    className="border rounded p-1 text-sm"
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