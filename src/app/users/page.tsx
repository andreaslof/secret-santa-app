import Link from 'next/link'
import { getAllUsers } from '@/lib/users'

async function getUsers() {
  try {
    const users = await getAllUsers()
    return users
  } catch {
    return []
  }
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <main className="md:min-w-[600px] flex flex-col" role="main">
      <Link href="/" className="font-xs text-blue-600 underline hover:text-blue-200">
        Home
      </Link>
      <header className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Link
          href="/users/create"
          className="p-2 px-4 border rounded-md bg-black hover:bg-blue-600 text-sm uppercase font-bold text-white no-underline"
        >
          Create
        </Link>
      </header>
      <ul className="list-disc list-inside">
        {users.map((user) => (
          <li key={user.id} className="text-gray-700">
            <Link href={`/users/${user.id}`} className="hover:underline">
              {user.name} ({user.email})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
