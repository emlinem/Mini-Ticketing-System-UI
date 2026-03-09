'use client'

import { useRouter } from 'next/navigation'
import { useTickets } from '@/hooks/useTickets'
import { TicketStatus, TicketAttachment } from '@/types/ticket'
import { use, useRef, useState, useMemo } from 'react'
import { getStatusColor, getStatusSelectColor, getPriorityColor, getPrioritySelectColor } from '@/utils/colorMappings'
import { formatStatus, formatPriority } from '@/utils/formatters'
import { useHydrated } from '@/hooks/useHydrated'
import { fileToDataUrl } from '@/utils/fileHandling'

export default function TicketDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const {
    tickets,
    updateStatus,
    removeAttachment,
    deleteTicket,
    addComment,
    deleteComment,
    addAttachments,
  } = useTickets()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { id } = use(params)
  const ticket = tickets.find((t) => t.id === id)

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [commentAuthor, setCommentAuthor] = useState('')
  const [commentText, setCommentText] = useState('')

  const isCommentValid = useMemo(
    () => commentAuthor.trim() !== '' && commentText.trim() !== '',
    [commentAuthor, commentText]
  )

  const hydrated = useHydrated()

  const formatDate = (value: Date | string) =>
    new Intl.DateTimeFormat('sv-SE', { timeZone: 'UTC' }).format(new Date(value))

  const formatDateTime = (value: Date | string) =>
    new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleMarkAsResolved = () => {
    if (!ticket) return
    updateStatus(ticket.id, 'closed')
  }

  const handleDelete = () => {
    if (!ticket) return
    deleteTicket(ticket.id)
    router.push('/')
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticket || !isCommentValid) return
    addComment(ticket.id, commentAuthor.trim(), commentText.trim())
    setCommentAuthor('')
    setCommentText('')
  }

  const handleDeleteComment = (commentId: string) => {
    if (!ticket) return
    deleteComment(ticket.id, commentId)
  }

  const handleAddAttachments = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ticket) return
    const files = e.target.files ? Array.from(e.target.files) : []
    if (!files.length) return

    const mapped: TicketAttachment[] = await Promise.all(
      files.map(async (file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: await fileToDataUrl(file),
        uploadedAt: new Date(),
      }))
    )

    addAttachments(ticket.id, mapped)
    e.target.value = ''
  }

  if (!hydrated) {
    return <main className="page-container py-8 text-gray-500">Loading ticket...</main>
  }

  if (!ticket) {
    return (
      <div className="min-h-screen p-10">
        <p>Ticket not found</p>
        <p>Looking for ID: {id}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="page-container space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← Back to Tickets
        </button>

        {/* Completion Banner */}
        {ticket.status === 'closed' && (
          <div className="bg-green-100 border border-green-300 text-green-800 px-6 py-4 rounded-lg">
            <p className="font-semibold">✓ This ticket has been marked as resolved.</p>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1 max-w-2xl">
            {isEditing ? (
              <input
                type="text"
                defaultValue={ticket.title}
                className="text-3xl font-bold mb-4 w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent py-1"
              />
            ) : (
              <h1 className="text-3xl font-bold mb-4 py-1">{ticket.title}</h1>
            )}
            <div className="flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {formatStatus(ticket.status)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                {formatPriority(ticket.priority)}
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {isEditing ? (
              <button 
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                Save Changes
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 whitespace-nowrap"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              {isEditing ? (
                <textarea
                  defaultValue={ticket.description}
                  className="textarea-field w-full"
                  rows={6}
                />
              ) : (
                <p className="text-gray-600">{ticket.description}</p>
              )}
            </div>

            {/* Comments */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Comments</h2>
              
              <div className="space-y-4 mb-6">
                {ticket.comments && ticket.comments.length > 0 ? (
                  ticket.comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{comment.author}</p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(comment.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label={`Delete comment by ${comment.author}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No comments yet</p>
                )}
              </div>

              <form onSubmit={handleAddComment} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="input-field w-full"
                />
                <textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="textarea-field w-full"
                  rows={4}
                />
                <button
                  type="submit"
                  disabled={!isCommentValid}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isCommentValid
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add a comment
                </button>
              </form>
            </div>

            {/* Attachments */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Attachments</h2>

              {ticket.attachments && ticket.attachments.length > 0 ? (
                <ul className="space-y-2 mb-4">
                  {ticket.attachments.map((file) => (
                    <li key={file.id} className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
                      <a
                        href={file.dataUrl}
                        download={file.name}
                        className="text-sm text-blue-700 hover:underline truncate"
                      >
                        {file.name}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeAttachment(ticket.id, file.id)}
                        className="text-red-600 hover:text-red-700"
                        aria-label={`Delete attachment ${file.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mb-4">No attachments</p>
              )}

              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleAddAttachments}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Upload file
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    {isEditing ? (
                      <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(ticket.id, e.target.value as TicketStatus)}
                        className={`select-field w-full ${getStatusSelectColor(ticket.status)}`}
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {formatStatus(ticket.status)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Priority</label>
                  <div className="mt-1">
                    {isEditing ? (
                      <select
                        className={`select-field w-full ${getPrioritySelectColor(ticket.priority)}`}
                        defaultValue={ticket.priority}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {formatPriority(ticket.priority)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <div className="mt-1">
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={ticket.category || ''}
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-gray-900">{ticket.category || 'N/A'}</p>
                    )}
                  </div>
                </div>

                {/* Assignee */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Assignee</label>
                  <div className="mt-1">
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={ticket.assignee || ''}
                        className="input-field w-full"
                      />
                    ) : (
                      <p className="text-gray-900">{ticket.assignee || 'Unassigned'}</p>
                    )}
                  </div>
                </div>

                {/* Created Date */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="mt-1 text-gray-900">{formatDate(ticket.createdAt)}</p>
                </div>

                {/* Updated Date */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Last updated</label>
                  <p className="mt-1 text-gray-900">{formatDate(ticket.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {ticket.status !== 'closed' && (
                  <button 
                    onClick={handleMarkAsResolved}
                    className="w-full bg-green-200 text-green-700 px-4 py-2 rounded-lg hover:bg-green-300 font-medium"
                  >
                    Mark as Resolved
                  </button>
                )}
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-red-200 text-red-700 px-4 py-2 rounded-lg hover:bg-red-300 font-medium"
                >
                  Delete Ticket
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2 className="text-xl font-semibold mb-4">Delete Ticket</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this ticket? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}