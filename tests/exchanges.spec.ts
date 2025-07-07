import { Exchange, User } from '@/app/generated/prisma'
import { AssignmentReceiver, MemberWithUser } from '@/lib/exchanges'
import { test, expect } from '@playwright/test'

interface TestData {
  exchange: Exchange
  users: User[]
}

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

  test.describe.serial('Exchange API Members & Assignments Management', () => {
    const testData: TestData = {
      exchange: {} as Exchange,
      users: [],
    }

    test.beforeAll(async ({ request }) => {
      // Create exchange
      const exchangeRes = await request.post('/api/exchanges', {
        data: { name: 'Match Test Exchange' },
      })
      testData.exchange = await exchangeRes.json()

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

      testData.users = users
    })

    test('should assign members and generate assignments', async ({ request }) => {
      const { exchange, users } = testData

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

    test('should be able to fetch assignments for an exchange', async ({ request }) => {
      const { exchange } = testData
      const { id: exchangeId } = exchange

      // Get assignments for exchange
      const assignmentRes = await request.get(`/api/exchanges/${exchangeId}/assignments`)
      expect(assignmentRes.ok()).toBeTruthy()
    })

    test('should be able to fetch an individual exchange member assigned receiver', async ({
      request,
    }) => {
      const { exchange } = testData
      const { id: exchangeId } = exchange

      // Get members of exchange
      const membersRes = await request.get(`/api/exchanges/${exchangeId}/members`)
      expect(membersRes.ok()).toBeTruthy()
      const members: MemberWithUser[] = await membersRes.json()
      const [member] = members
      const { id: memberId } = member

      // Get member assigned receiver
      const assignmentRes = await request.get(
        `/api/exchanges/${exchangeId}/assignments/${memberId}`,
      )
      expect(assignmentRes.ok()).toBeTruthy()
      const result: AssignmentReceiver = await assignmentRes.json()
      expect(result).toHaveProperty('exchangeId')
      expect(result.exchangeId).toEqual(exchangeId)
    })

    test('should be able to remove members from an exchange', async ({ request }) => {
      // Get exchange data and member data
      const { exchange, users } = testData
      const { id: exchangeId } = exchange
      const [member, ...remainingMembers] = users
      const { id: userId } = member

      // Remove member from exchange
      const removeMemberRes = await request.delete(`/api/exchanges/${exchangeId}/members/${userId}`)
      expect(removeMemberRes.ok()).toBeTruthy()
      const result = await removeMemberRes.json()
      expect(result).toHaveProperty('deleted')
      expect(result.deleted).toBeTruthy()

      // Update test data so the correct amount of members remain
      testData.users = remainingMembers
    })
  })
})
