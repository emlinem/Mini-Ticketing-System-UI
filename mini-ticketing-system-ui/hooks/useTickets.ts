'use client'

import { useState } from 'react'
import { Ticket, TicketStatus } from '@/types/ticket'

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])

  function addTicket(title: string, description: string) {
    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      title,
      description,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      assignee: null,
    }

    setTickets((prev) => [newTicket, ...prev])
  }

  function updateStatus(id: string, status: TicketStatus) {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, status } : ticket
      )
    )
  }

  return {
    tickets,
    addTicket,
    updateStatus,
  }
}