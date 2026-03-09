'use client'

import { useState, useEffect } from 'react'
import { Ticket, TicketStatus, TicketPriority } from '@/types/ticket'

const INITIAL_TICKETS: Ticket[] = [
  {
    id: '1-initial',
    title: 'Login page not loading',
    description: 'Users are experiencing issues loading the login page. The page appears blank after entering credentials.',
    status: 'open',
    priority: 'high',
    category: 'Bug',
    assignee: 'John Doe',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: '2-initial',
    title: 'Add dark mode support',
    description: 'Implement dark mode toggle for better user experience in low-light environments.',
    status: 'in-progress',
    priority: 'medium',
    category: 'Feature Request',
    assignee: 'Jane Smith',
    createdAt: new Date('2024-03-02'),
    updatedAt: new Date('2024-03-04'),
  },
  {
    id: '3-initial',
    title: 'Database connection timeout',
    description: 'Database queries are timing out during peak hours. Need to optimize connection pooling.',
    status: 'in-progress',
    priority: 'high',
    category: 'Bug',
    assignee: 'Mike Johnson',
    createdAt: new Date('2024-03-03'),
    updatedAt: new Date('2024-03-06'),
  },
  {
    id: '4-initial',
    title: 'Update documentation',
    description: 'API documentation needs to be updated with the latest endpoints and parameters.',
    status: 'open',
    priority: 'low',
    category: 'Documentation',
    assignee: undefined,
    createdAt: new Date('2024-03-04'),
    updatedAt: new Date('2024-03-04'),
  },
  {
    id: '5-initial',
    title: 'Fix broken links in footer',
    description: 'Several links in the footer are returning 404 errors.',
    status: 'closed',
    priority: 'low',
    category: 'Bug',
    assignee: 'Sarah Lee',
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-03-01'),
  },
]

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load tickets from localStorage on mount
  useEffect(() => {
    const savedTickets = localStorage.getItem('tickets')
    if (savedTickets) {
      try {
        const parsed = JSON.parse(savedTickets)
        const ticketsWithDates = parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
          comments: (t.comments || []).map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
          })),
        }))
        setTickets(ticketsWithDates)
      } catch (error) {
        console.error('Failed to parse tickets:', error)
        setTickets(INITIAL_TICKETS)
      }
    } else {
      // Initialize with premade tickets if no saved tickets exist
      setTickets(INITIAL_TICKETS)
      localStorage.setItem('tickets', JSON.stringify(INITIAL_TICKETS))
    }
    setIsLoaded(true)
  }, [])

  // Save tickets to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tickets', JSON.stringify(tickets))
    }
  }, [tickets, isLoaded])

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
      ...ticketData,
    }
    setTickets((prev) => [newTicket, ...prev])
  }

  function updateStatus(ticketId: string, newStatus: TicketStatus) {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, status: newStatus, updatedAt: new Date() }
          : ticket
      )
    )
  }

  function deleteTicket(ticketId: string) {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId))
  }

  function addComment(ticketId: string, author: string, text: string) {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const newComment = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            author,
            text,
            createdAt: new Date(),
          }
          return {
            ...ticket,
            comments: [...(ticket.comments || []), newComment],
            updatedAt: new Date(),
          }
        }
        return ticket
      })
    )
  }

  function deleteComment(ticketId: string, commentId: string) {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            comments: (ticket.comments || []).filter((c) => c.id !== commentId),
            updatedAt: new Date(),
          }
        }
        return ticket
      })
    )
  }

  return {
    tickets,
    addTicket,
    updateStatus,
    deleteTicket,
    addComment,
    deleteComment,
  }
}