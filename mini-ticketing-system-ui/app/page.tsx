'use client'

import { useTickets } from '@/hooks/useTickets'
import TicketForm from '@/components/TicketForm'
import TicketList from '@/components/TicketList'
import StatCard from '@/components/StatCard'

export default function Home() {
  const { tickets, addTicket, updateStatus } = useTickets()

  const open = tickets.filter((t) => t.status === 'open').length
  const inProgress = tickets.filter((t) => t.status === 'in-progress').length
  const closed = tickets.filter((t) => t.status === 'closed').length

  return (
    <main className="max-w-6xl mx-auto p-10 space-y-10">
    
    {/*Header*/}
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <p className="text-gray-500">Manage and track all support tickets</p>
      </div>

      <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">+ New Ticket</button>
    </div>

    {/*Stats*/}
    <div className="grid grid-cols-4 gap-6">
      <StatCard label="Total Tickets" value={tickets.length}/>
      <StatCard label="Open" value={open} color="text-blue-600"/>
      <StatCard label="In Progress" value={inProgress} color="text-yellow-500"/>
      <StatCard label="Closed" value={closed} color="text-green-600"/>
    </div>

    {/*Create Ticket*/}
    <TicketForm onCreate={addTicket} />

    {/*Ticket List*/}
    <TicketList
      tickets={tickets}
      onStatusChange={updateStatus}
    />

    </main>
  )
}