import Link from 'next/link'

export default async function Home() {
  const navRoutes = [
    {
      path: '/users',
      name: 'Manage Users',
    },
    {
      path: '/exchanges',
      name: 'Manage Exchanges',
    },
  ]

  return (
    <main className="md:min-w-[600px] flex flex-col" role="main">
      <header className="w-full flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Secret Santa App Admin</h1>
      </header>
      <ul className="list-none list-inside" data-test-id="app-nav">
        {navRoutes.map((route) => (
          <li key={route.path}>
            <Link href={route.path} className="text-blue-600 underline">
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
