import { TicketStatus, TicketPriority } from '@/types/ticket'

export const getStatusColor = (status: TicketStatus) => ({
  'open': 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  'approved': 'bg-yellow-100 text-yellow-700',
  'closed': 'bg-green-100 text-green-700',
}[status])

export const getStatusSelectColor = (status: TicketStatus) => ({
  'open': 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'approved': 'bg-yellow-100 text-yellow-800',
  'closed': 'bg-green-100 text-green-800',
}[status])

export const getPriorityColor = (priority: TicketPriority) => ({
  'low': 'bg-gray-100 text-gray-700',
  'medium': 'bg-orange-100 text-orange-700',
  'high': 'bg-red-100 text-red-700',
}[priority])

export const getPrioritySelectColor = (priority: TicketPriority) => ({
  low: 'bg-gray-200 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
}[priority])