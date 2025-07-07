import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
} from './users'

const fetchMock = vi.fn()

global.fetch = fetchMock

const mockUser = { id: '1', name: 'Alice', email: 'alice@example.com' }
const mockWishlistItem = { id: '1', userId: '1', label: 'Book' }

describe('lib/users.ts', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('fetches all users', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser],
    })
    const users = await getAllUsers()
    expect(users).toEqual([mockUser])
  })

  it('fetches user by ID', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    })
    const user = await getUserById('1')
    expect(user).toEqual(mockUser)
  })

  it('creates a user', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    })
    const user = await createUser({ name: 'Alice', email: 'alice@example.com' })
    expect(user).toEqual(mockUser)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/users'),
      expect.objectContaining({
        method: 'POST',
        body: expect.any(String),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    )
  })

  it('updates a user', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockUser, name: 'Alice Updated' }),
    })
    const user = await updateUser('1', { name: 'Alice Updated' })
    expect(user.name).toBe('Alice Updated')
  })

  it('deletes a user', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    })
    const user = await deleteUser('1')
    expect(user).toEqual(mockUser)
  })

  it('fetches wishlist', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockWishlistItem],
    })
    const items = await getWishlist('1')
    expect(items).toEqual([mockWishlistItem])
  })

  it('adds wishlist item', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWishlistItem,
    })
    const item = await addWishlistItem('1', 'Book')
    expect(item).toEqual(mockWishlistItem)
  })

  it('removes wishlist item', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockWishlistItem,
    })
    const item = await removeWishlistItem('1')
    expect(item).toEqual(mockWishlistItem)
  })
})
