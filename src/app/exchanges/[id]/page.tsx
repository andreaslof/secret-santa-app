import Link from 'next/link'
import { notFound } from 'next/navigation'

import ExchangeMembersAssignmentsContainer from '@/components/exchanges/ExchangeMembersAssignmentsContainer'
import { getAssignments, getExchangeById, getMembers } from '@/lib/exchanges'
import { getAllUsers } from '@/lib/users'

async function fetchExchange(id: string) {
  try {
    const exchange = await getExchangeById(id)
    return exchange
  } catch {
    return null
  }
}

export default async function ExchangeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const exchange = await fetchExchange(id)

  if (!exchange) {
    notFound()
  }

  const users = await getAllUsers()
  const members = await getMembers(id)
  const assignments = await getAssignments(id)

  return (
    <main className="md:min-w-[600px] flex flex-col items-center sm:items-start" role="main">
      <Link href="/exchanges" className="font-xs text-blue-600 underline hover:text-blue-200">
        Exchanges
      </Link>
      <header className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold mb-4">Exchange Detail</h1>
      </header>
      <div>
        <p>
          <strong>Name:</strong> {exchange.name}
        </p>
        <p>
          <strong>Created At:</strong> {new Date(exchange.createdAt).toLocaleString()}
        </p>
      </div>
      <ExchangeMembersAssignmentsContainer
        exchangeId={id}
        initialAssignments={assignments}
        initialMembers={members}
        allUsers={users}
      />
    </main>
  )
}
