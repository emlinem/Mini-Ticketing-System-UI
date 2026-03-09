'use client'

import { useTickets } from '@/hooks/useTickets'

export default function Home() {
  const { tickets } = useTickets()

  return (
    <main>
      <h1>Support Ticket Manager</h1>
      <p>{tickets.length} tickets</p>
    </main>
  )
}