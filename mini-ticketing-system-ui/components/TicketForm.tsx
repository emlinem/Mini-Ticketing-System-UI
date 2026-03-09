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
        <label className="block text-sm font-medium mb-1">
        Title *
        </label>
        <input
        type="text"
        placeholder="Brief description of the issue"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
        required
        />
    </div>

    {/* Description */}
    <div>
        <label className="block text-sm font-medium mb-1">
        Description *
        </label>
        <textarea
        placeholder="Provide detailed information about the ticket"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
        required
        />
    </div>

    {/* Priority + Status */}
    <div className="grid grid-cols-2 gap-4">

        <div>
        <label className="block text-sm font-medium mb-1">
            Priority *
        </label>
        <select
            value={priority}
            onChange={(e) =>
            setPriority(e.target.value as TicketPriority)
            }
            className="w-full border p-2 rounded"
        >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
        </div>

        <div>
        <label className="block text-sm font-medium mb-1">
            Status *
        </label>
        <select
            value={status}
            onChange={(e) =>
            setStatus(e.target.value as TicketStatus)
            }
            className="w-full border p-2 rounded"
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
        <label className="block text-sm font-medium mb-1">
            Category
        </label>
        <input
            type="text"
            placeholder="Bug, Feature request, etc."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded"
        />
        </div>

        <div>
        <label className="block text-sm font-medium mb-1">
            Assignee
        </label>
        <input
            type="text"
            placeholder="Assign to team member"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full border p-2 rounded"
        />
        </div>

    </div>

    {/* Attachments */}
    <div>
        <label className="block text-sm font-medium mb-1">
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
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer inline-block hover:bg-gray-300"
        >
        Choose Files
        </label>
    </div>

    {/* Submit */}
    <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
    >
        Create Ticket
    </button>

    </form>
  )
}