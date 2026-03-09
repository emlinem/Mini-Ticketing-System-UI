'use client'

import { useState } from 'react'
import { Ticket, TicketPriority, TicketStatus } from '@/types/ticket'

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])

function addTicket(ticketData: {
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category?: string
  assignee?: string
  attachments?: File[]
    }) {

    const newTicket: Ticket = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...ticketData
    }

    setTickets(prev => [newTicket, ...prev])
    }

  function updateStatus(ticketId: string, newStatus: TicketStatus) {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: newStatus, updatedAt: new Date() }
          : ticket
      )
    )
  }

  return {
    tickets,
    addTicket,
    updateStatus,
  }
}