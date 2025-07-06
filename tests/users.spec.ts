import { test, expect, request } from '@playwright/test'

test.describe('Users API', () => {
  test('should create and fetch a user', async ({ request }) => {
    const createRes = await request.post('/api/users', {
      data: { name: 'Jane', email: 'jane@example.com' },
    })
    expect(createRes.ok()).toBeTruthy()
    const createdUser = await createRes.json()
    expect(createdUser).toHaveProperty('id')
    expect(createdUser.name).toBe('Jane')

    const getRes = await request.get('/api/users')
    expect(getRes.ok()).toBeTruthy()
    const users = await getRes.json()
    expect(users).toEqual(
      expect.arrayContaining([expect.objectContaining({ email: 'jane@example.com' })]),
    )
  })
})
