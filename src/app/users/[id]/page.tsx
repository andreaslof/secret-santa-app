import { getUserById } from '@/lib/users'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function fetchUser(id: string) {
  try {
    const user = await getUserById(id)
    return user
  } catch {
    return null
  }
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await fetchUser(id)

  if (!user) {
    notFound()
  }

  return (
    <main className="md:min-w-[600px] flex flex-col items-center sm:items-start" role="main">
      <Link href="/users" className="font-xs text-blue-600 underline hover:text-blue-200">
        Users
      </Link>
      <header className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold mb-4">User Detail</h1>
      </header>
      <div>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </main>
  )
}
