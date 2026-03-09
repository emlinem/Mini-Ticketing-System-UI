'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal'
import { useTickets } from '@/hooks/useTickets'
import TicketForm from '@/components/TicketForm'
import StatCard from '@/components/StatCard'
import { TicketStatus, TicketPriority } from '@/types/ticket'
type SortBy = 'title' | 'status' | 'priority' | 'category' | 'assignee' | 'createdAt' | 'updatedAt'
type SortOrder = 'asc' | 'desc'

export default function Home() {
  const router = useRouter()
  const { tickets, addTicket, updateStatus } = useTickets()
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('')
  const [sortBy, setSortBy] = useState<SortBy>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const open = tickets.filter((t) => t.status === 'open').length
  const inProgress = tickets.filter((t) => t.status === 'in-progress').length
  const closed = tickets.filter((t) => t.status === 'closed').length

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !statusFilter || ticket.status === statusFilter
      const matchesPriority = !priorityFilter || ticket.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tickets, searchTerm, statusFilter, priorityFilter])

  const sortedTickets = useMemo(() => {
    return [...filteredTickets].sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortBy === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3 }
        aValue = priorityOrder[a.priority]
        bValue = priorityOrder[b.priority]
      } else if (sortBy === 'status') {
        const statusOrder = { open: 1, 'in-progress': 2, closed: 3 }
        aValue = statusOrder[a.status]
        bValue = statusOrder[b.status]
      }
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredTickets, sortBy, sortOrder])

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

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

        {/* Filters */}
        <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field bg-gray-100 w-48 px-2 py-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TicketStatus | '')}
            className="select-field bg-gray-100 px-2 py-1"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | '')}
            className="select-field bg-gray-100 px-2 py-1"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Ticket Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-80 hover:bg-gray-100">
                  <button onClick={() => handleSort('title')} className="flex items-center w-full text-left">
                    Title <span className="text-xs ml-1" style={{ opacity: sortBy === 'title' ? 1 : 0 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-32 hover:bg-gray-100">
                  <button onClick={() => handleSort('status')} className="flex items-center w-full text-left">
                    Status <span className="text-xs ml-1" style={{ opacity: sortBy === 'status' ? 1 : 0 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-24 hover:bg-gray-100">
                  <button onClick={() => handleSort('priority')} className="flex items-center w-full text-left">
                    Priority <span className="text-xs ml-1" style={{ opacity: sortBy === 'priority' ? 1 : 0 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-32 hover:bg-gray-100">
                  <button onClick={() => handleSort('category')} className="flex items-center w-full text-left">
                    Category <span className="text-xs ml-1" style={{ opacity: sortBy === 'category' ? 1 : 0 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-40 hover:bg-gray-100">
                  <button onClick={() => handleSort('assignee')} className="flex items-center w-full text-left">
                    Assigned to <span className="text-xs ml-1" style={{ opacity: sortBy === 'assignee' ? 1 : 0 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-32 hover:bg-gray-100">
                  <button onClick={() => handleSort('createdAt')} className="flex items-center w-full text-left">
                    Created <span className="text-xs ml-1" style={{ opacity: sortBy === 'createdAt' ? 1 : 0 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider w-32 hover:bg-gray-100">
                  <button onClick={() => handleSort('updatedAt')} className="flex items-center w-full text-left">
                    Last Updated <span className="text-xs ml-1" style={{ opacity: sortBy === 'updatedAt' ? 1 : 0 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => router.push(`/tickets/${ticket.id}`)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ticket.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <select
                      onClick={(e) => e.stopPropagation()}
                      value={ticket.status}
                      onChange={(e) => updateStatus(ticket.id, e.target.value as TicketStatus)}
                      className="select-field"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.category || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.assignee || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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