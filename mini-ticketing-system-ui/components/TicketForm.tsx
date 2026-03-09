'use client'

import { useState } from 'react'

type Props = {
  onCreate: (title: string, description: string) => void
}

export default function TicketForm({ onCreate }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) return

    onCreate(title, description)

    setTitle('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Ticket title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Describe the issue"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create Ticket
      </button>
    </form>
  )
}