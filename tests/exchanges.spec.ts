import { Exchange } from '@/app/generated/prisma'
import { MemberWithUser } from '@/lib/exchanges'
import { test, expect } from '@playwright/test'
import { assert } from 'console'

test.describe('Exchanges API', () => {
  test('should create and retrieve an exchange', async ({ request }) => {
    const createRes = await request.post('/api/exchanges', {
      data: { name: 'Test Exchange' },
    })
    expect(createRes.ok()).toBeTruthy()
    const exchange = await createRes.json()
    expect(exchange).toHaveProperty('id')
    expect(exchange.name).toBe('Test Exchange')

    const getRes = await request.get(`/api/exchanges/${exchange.id}`)
    expect(getRes.ok()).toBeTruthy()
    const fetched = await getRes.json()
    expect(fetched.id).toBe(exchange.id)
  })

  test('should assign members and generate assignments', async ({ request }) => {
    // Create exchange
    const exchangeRes = await request.post('/api/exchanges', {
      data: { name: 'Match Test Exchange' },
    })
    const exchange: Exchange = await exchangeRes.json()

    // Create users
    const users = await Promise.all(
      ['A', 'B', 'C'].map((name) =>
        request
          .post('/api/users', {
            data: { name, email: `${name}@example.com` },
          })
          .then((r) => r.json()),
      ),
    )

    // Add users as members
    const memberRes = await request.post(`/api/exchanges/${exchange.id}/members`, {
      data: { userIds: users.map((u) => u.id) },
    })
    expect(memberRes.ok()).toBeTruthy()

    // Generate matches
    const matchRes = await request.post(`/api/exchanges/${exchange.id}/generate-matches`)
    expect(matchRes.ok()).toBeTruthy()
    const result = await matchRes.json()
    expect(result).toHaveProperty('created')
    expect(result.created).toBe(3)
  })

  test.skip('should be able to remove members from an exchange', async ({ request }) => {
    const exchangesRes = await request.get('/api/exchanges')
    const exchanges: Exchange[] = await exchangesRes.json()
    console.log(exchanges)
    const exchange = exchanges.find((exchange) => {
      return exchange.name === 'Match Test Exchange'
    })

    if (!exchange) throw new Error('error fetching exchanges')

    const { id: exchangeId } = exchange

    // Fetch members for exchange
    const membersRes = await request.get(`/api/exchanges/${exchangeId}/members`)
    const members: MemberWithUser[] = await membersRes.json()
    const [member] = members
    const { userId } = member

    // Remove member from exchange
    const removeMemberRes = await request.delete(`/api/exchanges/${exchangeId}/members/${userId}`)
    expect(removeMemberRes.ok()).toBeTruthy()
    const result = await removeMemberRes.json()
    expect(result).toHaveProperty('deleted')
    expect(result.deleted).toBeTruthy()
  })
})
