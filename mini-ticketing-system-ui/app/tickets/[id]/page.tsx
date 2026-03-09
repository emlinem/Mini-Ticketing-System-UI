'use client'

import { useRouter } from 'next/navigation'
import { useTickets } from '@/hooks/useTickets'
import { TicketStatus } from '@/types/ticket'

export default function TicketDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { tickets, updateStatus } = useTickets()
  const ticket = tickets.find((t) => t.id === params.id)

  if (!ticket) {
    return (
      <div className="min-h-screen p-10">
        <p>Ticket not found</p>
      </div>
    )
  }

  const getStatusColor = (status: TicketStatus) => {
    const colors = {
      'open': 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-yellow-100 text-yellow-700',
      'closed': 'bg-green-100 text-green-700',
    }
    return colors[status] || ''
  }

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'low': 'bg-gray-100 text-gray-700',
      'medium': 'bg-orange-100 text-orange-700',
      'high': 'bg-red-100 text-red-700',
    }
    return colors[priority] || ''
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="page-container space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back to Tickets
        </button>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-4">{ticket.title}</h1>
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="text-blue-600 hover:text-blue-800">✏️ Edit</button>
            <button className="text-red-600 hover:text-red-800">🗑️ Delete</button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600">{ticket.description}</p>
            </div>

            {/* Comments */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Comments</h2>
              <p className="text-gray-600 mb-4">No comments yet</p>
              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="input-field w-full"
                />
                <textarea
                  placeholder="Add a comment..."
                  className="textarea-field w-full"
                  rows={4}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  → Add a comment
                </button>
              </form>
            </div>

            {/* Attachments */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Attachments</h2>
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                ⬇️ Upload file
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => updateStatus(ticket.id, e.target.value as TicketStatus)}
                    className="select-field w-full mt-1"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Priority</label>
                  <p className="mt-1 text-gray-900 capitalize">{ticket.priority}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Assignee</label>
                  <p className="mt-1 text-gray-900">{ticket.assignee || 'Unassigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="mt-1 text-gray-900">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last updated</label>
                  <p className="mt-1 text-gray-900">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full bg-green-200 text-green-700 px-4 py-2 rounded-lg hover:bg-green-300 font-medium">
                  Mark as Resolved
                </button>
                <button className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium">
                  Close ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}