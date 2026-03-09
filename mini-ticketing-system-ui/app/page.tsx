'use client'

import { useTickets } from '@/hooks/useTickets'
import TicketForm from '@/components/TicketForm'
import TicketList from '@/components/TicketList'

export default function Home() {
  const { tickets, addTicket } = useTickets()

  return (
    <main className="max-w-3xl mx-auto p-10 space-y-8">
      <h1 className="text-3xl font-bold">Support Ticket Manager</h1>

      <TicketForm onCreate={addTicket} />
      <TicketList tickets={tickets}/>
    </main>
  )
}