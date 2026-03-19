'use client'

import { useEffect, useRef, useState } from 'react'
import { Ticket, TicketStatus, TicketPriority, TicketAttachment } from '@/types/ticket'

// Initial sample tickets
const INITIAL_TICKETS: Ticket[] = [
  {
    id: '1-initial',
    title: 'Login page not loading',
    description: 'Users are experiencing issues loading the login page. The page appears blank after entering credentials.',
    status: TicketStatus.open,
    priority: 'high',
    category: 'Bug',
    assignee: 'John Doe',
    createdAt: new Date('2026-02-26'),
    updatedAt: new Date('2026-03-02'),
  },
  {
    id: '2-initial',
    title: 'Add dark mode support',
    description: 'Implement dark mode toggle for better user experience in low-light environments.',
    status: TicketStatus.inProgress,
    priority: 'medium',
    category: 'Feature Request',
    assignee: 'Jane Smith',
    createdAt: new Date('2026-02-27'),
    updatedAt: new Date('2026-03-03'),
  },
  {
    id: '3-initial',
    title: 'Database connection timeout',
    description: 'Database queries are timing out during peak hours. Need to optimize connection pooling.',
    status: TicketStatus.inProgress,
    priority: 'high',
    category: 'Bug',
    assignee: 'Mike Johnson',
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-03-05'),
  },
  {
    id: '4-initial',
    title: 'Update documentation',
    description: 'API documentation needs to be updated with the latest endpoints and parameters.',
    status: TicketStatus.open,
    priority: 'low',
    category: 'Documentation',
    assignee: undefined,
    createdAt: new Date('2026-03-02'),
    updatedAt: new Date('2026-03-02'),
  },
  {
    id: '5-initial',
    title: 'Fix broken links in footer',
    description: 'Several links in the footer are returning 404 errors.',
    status: TicketStatus.closed,
    priority: 'low',
    category: 'Bug',
    assignee: 'Sarah Lee',
    createdAt: new Date('2026-02-25'),
    updatedAt: new Date('2026-03-01'),
  },
]

type StoredComment = {
  id: string
  author: string
  text: string
  createdAt: string
}

type StoredAttachment = Omit<TicketAttachment, 'uploadedAt'> & {
  uploadedAt: string
}

type StoredTicket = Omit<Ticket, 'createdAt' | 'updatedAt' | 'comments' | 'attachments'> & {
  createdAt: string
  updatedAt: string
  comments?: StoredComment[]
  attachments?: StoredAttachment[]
}

function hydrateTickets(raw: StoredTicket[]): Ticket[] {
  return raw.map((t) => ({
    ...t,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
    comments: (t.comments || []).map((c) => ({
      ...c,
      createdAt: new Date(c.createdAt),
    })),
    attachments: (t.attachments || []).map((a) => ({
      ...a,
      uploadedAt: new Date(a.uploadedAt),
    })),
  }))
}

function getInitialTickets(): Ticket[] {
  if (typeof window === 'undefined') return INITIAL_TICKETS

  const saved = localStorage.getItem('tickets')
  if (!saved) return INITIAL_TICKETS

  try {
    const parsed = JSON.parse(saved) as StoredTicket[]
    return hydrateTickets(parsed)
  } catch (error) {
    console.error('Failed to parse tickets:', error)
    return INITIAL_TICKETS
  }
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>(getInitialTickets)
  const hasMounted = useRef(false)

  // Persist tickets to localStorage whenever they change (skip first render)
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
    localStorage.setItem('tickets', JSON.stringify(tickets))
  }, [tickets])

  // Create a new ticket
  function addTicket(ticketData: {
    title: string
    description: string
    status: TicketStatus
    priority: TicketPriority
    category?: string
    assignee?: string
    attachments?: TicketAttachment[]
  }) {
    const newTicket: Ticket = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...ticketData,
    }
    setTickets((prev) => [newTicket, ...prev])
  }

  // Update ticket status
  function updateStatus(ticketId: string, newStatus: TicketStatus) {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, status: newStatus, updatedAt: new Date() }
          : ticket
      )
    )
  }

  // Delete a ticket
  function deleteTicket(ticketId: string) {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId))
  }

  // Add a comment to a ticket
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

  // Delete a comment from a ticket
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

  // Add attachments to a ticket
  function addAttachments(ticketId: string, newAttachments: TicketAttachment[]) {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              attachments: [...(ticket.attachments || []), ...newAttachments],
              updatedAt: new Date(),
            }
          : ticket
      )
    )
  }

  // Remove an attachment from a ticket
  function removeAttachment(ticketId: string, attachmentId: string) {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              attachments: (ticket.attachments || []).filter((a) => a.id !== attachmentId),
              updatedAt: new Date(),
            }
          : ticket
      )
    )
  }

  return {
    tickets,
    addTicket,
    updateStatus,
    deleteTicket,
    addComment,
    deleteComment,
    addAttachments,
    removeAttachment,  }
}