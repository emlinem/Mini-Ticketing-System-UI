'use client'

import { useMemo, useState } from 'react'
import { TicketAttachment, TicketPriority, TicketStatus } from "@/types/ticket"

type Props = {
  onCreate: (ticketData: {
    title: string
    description: string
    priority: TicketPriority
    status: TicketStatus
    category?: string
    assignee?: string
    attachments?: TicketAttachment[]
  }) => void
}

export default function TicketForm({ onCreate }: Props) {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TicketStatus>('open')
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const [category, setCategory] = useState("")
  const [assignee, setAssignee] = useState("")
  const [attachments, setAttachments] = useState<TicketAttachment[]>([])

  const isValid = useMemo(() => {
    return title.trim().length > 0 && description.trim().length > 0
  }, [title, description])

  const getStatusSelectColor = (value: TicketStatus) => {
    const map = {
      open: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      closed: 'bg-green-100 text-green-800',
    }
    return map[value]
  }

  const getPrioritySelectColor = (value: TicketPriority) => {
    const map = {
      low: 'bg-gray-200 text-gray-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800',
    }
    return map[value]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    onCreate({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category: category.trim() || undefined,
      assignee: assignee.trim() || undefined,
      attachments
    })

    setTitle("")
    setDescription("")
    setStatus('open')
    setPriority('medium')
    setCategory("")
    setAssignee("")
    setAttachments([])
  }

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (!files.length) return

    const mapped = await Promise.all(
      files.map(async (file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: await fileToDataUrl(file),
        uploadedAt: new Date(),
      }))
    )

    setAttachments((prev) => [...prev, ...mapped])
    e.target.value = ''
  }

  const removeLocalAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Required fields hint */}
      <p className="text-sm text-gray-600">
        <span className="text-red-600 font-semibold">*</span> Required fields
      </p>

      {/* Title */}
      <div>
        <label className="form-label flex items-center gap-1">
          Title <span className="text-red-600 font-semibold">*</span>
        </label>
        <input
          type="text"
          placeholder="Brief description of the issue"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          required
          aria-required="true"
        />
      </div>

      {/* Description */}
      <div>
        <label className="form-label flex items-center gap-1">
          Description <span className="text-red-600 font-semibold">*</span>
        </label>
        <textarea
          placeholder="Provide detailed information about the ticket"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea-field"
          required
          aria-required="true"
        />
      </div>

      {/* Priority + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label flex items-center gap-1">
            Priority <span className="text-red-600 font-semibold">*</span>
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)}
            className="select-field"
            required
            aria-required="true"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="form-label flex items-center gap-1">
            Status <span className="text-red-600 font-semibold">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TicketStatus)}
            className="select-field"
            required
            aria-required="true"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Category + Assignee */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">
            Category
          </label>
          <input
            type="text"
            placeholder="Bug, Feature request, etc."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="form-label">
            Assignee
          </label>
          <input
            type="text"
            placeholder="Assign to team member"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Attachments */}
      <div>
        <label className="form-label">
        Attachments
        </label>
        <input
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        />
        <label
        htmlFor="file-upload"
        className="file-upload-button"
        >
        Choose Files
        </label>
      </div>

      {attachments.length > 0 && (
        <ul className="mt-3 space-y-2">
          {attachments.map((file) => (
            <li key={file.id} className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2 text-sm">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeLocalAttachment(file.id)}
                className="text-red-600 hover:text-red-700"
                aria-label={`Delete attachment ${file.name}`}
                title="Delete attachment"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid}
        className="primary-button w-full"
      >
        Create Ticket
      </button>

    </form>
  )
}