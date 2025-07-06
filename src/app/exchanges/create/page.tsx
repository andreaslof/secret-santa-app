'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createExchange } from '@/lib/exchanges'
import Link from 'next/link'

export default function CreateExchangePage() {
  const router = useRouter()
  const [name, setName] = useState('')

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      await createExchange({ name })
      router.push('/exchanges')
    },
    [name, router],
  )

  return (
    <main className="flex flex-col" role="main">
      <Link href="/exchanges" className="font-xs text-blue-600 underline hover:text-blue-200">
        Exchanges
      </Link>
      <header className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold mb-4">Create Exchange</h1>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Exchange name"
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" className="p-2 px-4 border rounded-md bg-black hover:bg-blue-600 text-sm uppercase font-bold text-white no-underline cursor-pointer">
          Create
        </button>
      </form>
    </main>
  )
}
