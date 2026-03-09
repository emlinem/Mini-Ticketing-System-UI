'use client'

import { useState } from 'react'
import Modal from '@/components/Modal'
import { useTickets } from '@/hooks/useTickets'
import TicketForm from '@/components/TicketForm'
import TicketList from '@/components/TicketList'
import StatCard from '@/components/StatCard'

export default function Home() {
  const { tickets, addTicket, updateStatus } = useTickets()
  const [showModal, setShowModal] = useState(false)

  const open = tickets.filter((t) => t.status === 'open').length
  const inProgress = tickets.filter((t) => t.status === 'in-progress').length
  const closed = tickets.filter((t) => t.status === 'closed').length

  return (
    <div className="min-h-screen">
      <main className="page-container space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-gray-500">Manage and track all support tickets</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            + New Ticket
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Total Tickets" value={tickets.length}/>
          <StatCard label="Open" value={open} color="text-blue-600"/>
          <StatCard label="In Progress" value={inProgress} color="text-yellow-500"/>
          <StatCard label="Closed" value={closed} color="text-green-600"/>
        </div>

        {/* Ticket List */}
        <TicketList
          tickets={tickets}
          onStatusChange={updateStatus}
        />

        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <h2 className="text-xl font-semibold mb-4">
              Create Ticket
            </h2>

            <TicketForm
              onCreate={(ticketData) => {
                addTicket(ticketData)
                setShowModal(false)
              }}
            />
          </Modal>
        )}
      </main>
    </div>
  )
}