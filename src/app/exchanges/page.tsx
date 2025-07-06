import Link from 'next/link'
import { getAllExchanges } from '@/lib/exchanges'

async function getExchanges() {
  try {
    const exchanges = await getAllExchanges()
    return exchanges
  } catch {
    return []
  }
}

export default async function ExchangesPage() {
  const exchanges = await getExchanges()

  return (
    <main className="md:min-w-[600px] flex flex-col" role="main">
      <Link href="/" className="font-xs text-blue-600 underline hover:text-blue-200">
        Home
      </Link>
      <header className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Exchanges</h1>
        <Link
          href="/exchanges/create"
          className="p-2 px-4 border rounded-md bg-black hover:bg-blue-600 text-sm uppercase font-bold text-white no-underline"
        >
          Create
        </Link>
      </header>
      <ul className="list-disc list-inside">
        {exchanges.map((exchange) => (
          <li key={exchange.id} className="text-gray-700">
            <Link href={`/exchanges/${exchange.id}`} className="hover:underline">
              {exchange.name} — {new Date(exchange.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
