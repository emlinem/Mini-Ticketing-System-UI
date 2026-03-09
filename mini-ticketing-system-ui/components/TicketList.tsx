import {Ticket, TicketStatus} from "@/types/ticket"

type Props = {
  tickets: Ticket[]
  onStatusChange?: (id: string, status: TicketStatus) => void
}

export default function TicketList({ tickets }: Props) {
    if (tickets.length === 0) {
        return <p className="text-gray-500 ">No tickets yet.</p>
    }

    function onStatusChange(id: string, arg1: string): void {
        throw new Error("Function not implemented.")
    }

    return(
        <div className="space-y-4">{tickets.map((ticket)=>(
            <div key={ticket.id} className="border p-4 rounded p-4 bg-white shadow-sm">
                <h3 className="font-semibold">{ticket.title}</h3>
                <p className="text-gray-600 mt-1">{ticket.description}</p>
                <div className="mt-3">
                    <label className="text-sm mr-2">Status:</label>
                    <select
                        value={ticket.status}
                        onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
                        className="border rounded p-1 text-sm">
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