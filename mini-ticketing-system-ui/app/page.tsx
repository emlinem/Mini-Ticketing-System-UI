'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTickets } from '@/hooks/useTickets'
import { useHydrated } from '@/hooks/useHydrated'
import Modal from '@/components/Modal'
import TicketForm from '@/components/TicketForm'
import { getStatusColor, getPriorityColor } from '@/utils/colorMappings'
import { formatPriority, formatStatus } from '@/utils/formatters'
import type { TicketPriority, TicketStatus } from '@/types/ticket'

type SortBy = 'title' | 'status' | 'priority' | 'category' | 'assignee' | 'createdAt' | 'updatedAt'
type SortOrder = 'asc' | 'desc'

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col items-center">
      <div className={`text-2xl font-bold ${color ?? 'text-gray-900'}`}>{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const { tickets, addTicket } = useTickets()
  const hydrated = useHydrated()

  // UI state
  const [showModal, setShowModal] = useState(false)

  // Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('')

  // Sort state
  const [sortBy, setSortBy] = useState<SortBy>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // Stat calculations
  const statsCount = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in-progress').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  }), [tickets])

  // Filter tickets based on search and filters
  const filteredTickets = useMemo(() => {
    const formatSearchDate = (value: Date | string) =>
      new Intl.DateTimeFormat('sv-SE', { timeZone: 'UTC' }).format(new Date(value))

    return tickets.filter(ticket => {
      const query = searchTerm.trim().toLowerCase()
      const matchesSearch =
        query === '' ||
        [
          ticket.title,
          ticket.description,
          ticket.assignee ?? '',
          ticket.category ?? '',
          ticket.status,
          formatStatus(ticket.status),
          ticket.priority,
          formatPriority(ticket.priority),
          formatSearchDate(ticket.createdAt),
          formatSearchDate(ticket.updatedAt),
          new Date(ticket.createdAt).toISOString().slice(0, 10),
          new Date(ticket.updatedAt).toISOString().slice(0, 10),
        ]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesStatus = !statusFilter || ticket.status === statusFilter
      const matchesPriority = !priorityFilter || ticket.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tickets, searchTerm, statusFilter, priorityFilter])

  // Sort tickets
  const sortedTickets = useMemo(() => {
    return [...filteredTickets].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(a[sortBy]).getTime()
        bValue = new Date(b[sortBy]).getTime()
      } else if (sortBy === 'priority') {
        const priorityOrder: Record<TicketPriority, number> = { low: 1, medium: 2, high: 3 }
        aValue = priorityOrder[a.priority]
        bValue = priorityOrder[b.priority]
      } else if (sortBy === 'status') {
        const statusOrder: Record<TicketStatus, number> = { open: 1, 'in-progress': 2, closed: 3 }
        aValue = statusOrder[a.status]
        bValue = statusOrder[b.status]
      } else {
        aValue = String(a[sortBy] ?? '').toLowerCase()
        bValue = String(b[sortBy] ?? '').toLowerCase()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredTickets, sortBy, sortOrder])

  // Toggle sort column and order
  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  // Clear all active filters
  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setPriorityFilter('')
  }

  const formatDate = (value: Date | string) =>
    new Intl.DateTimeFormat('sv-SE', { timeZone: 'UTC' }).format(new Date(value))

  if (!hydrated) {
    return <main className="page-container py-8 text-gray-500">Loading tickets...</main>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="page-container space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center pt-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Support Tickets</h1>
            <p className="text-gray-600 mt-1">Manage and track all support tickets</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Ticket
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Total Tickets" value={statsCount.total} />
          <StatCard label="Open" value={statsCount.open} color="text-blue-600" />
          <StatCard label="In Progress" value={statsCount.inProgress} color="text-yellow-500" />
          <StatCard label="Closed" value={statsCount.closed} color="text-green-600" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search input */}
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TicketStatus | '')}
              className="h-10 px-4 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer text-gray-700"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>

            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | '')}
              className="h-10 px-4 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer text-gray-700"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            {/* Clear filters button */}
            <button
              onClick={clearFilters}
              disabled={!searchTerm && !statusFilter && !priorityFilter}
              className="h-10 px-4 font-medium transition-colors disabled:text-gray-400 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Ticket Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {/* Column headers with sort buttons */}
                  {['title', 'status', 'priority', 'category', 'assignee', 'createdAt', 'updatedAt'].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hover:bg-gray-100 transition-colors"
                    >
                      <button
                        onClick={() => handleSort(col as SortBy)}
                        className="flex items-center w-full text-left"
                      >
                        {col === 'createdAt' ? 'Created' : col === 'updatedAt' ? 'Last Updated' : col === 'assignee' ? 'Assigned to' : col.charAt(0).toUpperCase() + col.slice(1)}
                        <span
                          className="text-xs ml-1 font-bold"
                          style={{ opacity: sortBy === col ? 1 : 0 }}
                        >
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTickets.length > 0 ? (
                  sortedTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {ticket.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {formatStatus(ticket.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {formatPriority(ticket.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {ticket.category || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {ticket.assignee || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(ticket.updatedAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium">No tickets found</p>
                        <p className="text-sm">Try adjusting your filters or create a new ticket</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Ticket Modal */}
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <h2 className="text-xl font-semibold mb-4">Create Ticket</h2>
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