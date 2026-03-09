'use client'

import { useState } from "react"
import { TicketPriority, TicketStatus } from "@/types/ticket"

type Props = {
  onCreate: (ticketData: {
    title: string
    description: string
    priority: TicketPriority
    status: TicketStatus
    category?: string
    assignee?: string
    attachments?: File[]
  }) => void
}

export default function TicketForm({ onCreate }: Props) {

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<TicketPriority>("low")
  const [status, setStatus] = useState<TicketStatus>("open")
  const [category, setCategory] = useState("")
  const [assignee, setAssignee] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !description.trim()) return

    onCreate({
      title,
      description,
      priority,
      status,
      category,
      assignee,
      attachments
    })

    setTitle("")
    setDescription("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

  {/* Title */}
    <div>
        <label className="form-label">
        Title *
        </label>
        <input
        type="text"
        placeholder="Brief description of the issue"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input-field"
        required
        />
    </div>

    {/* Description */}
    <div>
        <label className="form-label">
        Description *
        </label>
        <textarea
        placeholder="Provide detailed information about the ticket"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea-field"
        required
        />
    </div>

    {/* Priority + Status */}
    <div className="grid grid-cols-2 gap-4">

        <div>
        <label className="form-label">
            Priority *
        </label>
        <select
            value={priority}
            onChange={(e) =>
            setPriority(e.target.value as TicketPriority)
            }
            className="select-field"
        >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
        </div>

        <div>
        <label className="form-label">
            Status *
        </label>
        <select
            value={status}
            onChange={(e) =>
            setStatus(e.target.value as TicketStatus)
            }
            className="select-field"
        >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
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
        onChange={(e) =>
            setAttachments(
            e.target.files ? Array.from(e.target.files) : []
            )
        }
        className="hidden"
        />
        <label
        htmlFor="file-upload"
        className="file-upload-button"
        >
        Choose Files
        </label>
    </div>

    {/* Submit */}
    <button
        type="submit"
        className="primary-button w-full"
    >
        Create Ticket
    </button>

    </form>
  )
}