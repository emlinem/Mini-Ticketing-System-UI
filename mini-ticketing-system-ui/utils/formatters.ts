import { TicketStatus, TicketPriority } from '@/types/ticket'

export const formatStatus = (status: TicketStatus) => ({
  'open': 'Open',
  'in-progress': 'In Progress',
  'closed': 'Closed',
}[status])

export const formatPriority = (priority: TicketPriority) => 
  priority.charAt(0).toUpperCase() + priority.slice(1)