import {Ticket} from "@/types/ticket"

type Props = {
  tickets: Ticket[]
}

export default function TicketList({ tickets }: Props) {
    if (tickets.length === 0) {
        return <p className="text-gray-500 ">No tickets yet.</p>
    }

    return(
        <div className="space-y-4">{tickets.map((ticket)=>(
            <div key={ticket.id} className="border p-4 rounded p-4 bg-white shadow-sm">
                <h3 className="font-semibold">{ticket.title}</h3>
                <p className="text-gray-600 mt-1">{ticket.description}</p>
                <p className="text-sm mt-2">Status: {ticket.status}</p>
            </div>
        ))}
        </div>
    )
}