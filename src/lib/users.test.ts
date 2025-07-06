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

global.fetch = vi.fn()

const mockUser = { id: '1', name: 'Alice', email: 'alice@example.com' }
const mockWishlistItem = { id: '1', userId: '1', label: 'Book' }

describe('lib/users.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches all users', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockUser],
    } as Response)
    const users = await getAllUsers()
    expect(users).toEqual([mockUser])
  })

  it('fetches user by ID', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    } as Response)
    const user = await getUserById('1')
    expect(user).toEqual(mockUser)
  })

  it('creates a user', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    } as Response)
    const user = await createUser({ name: 'Alice', email: 'alice@example.com' })
    expect(user).toEqual(mockUser)
  })

  it('updates a user', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockUser, name: 'Alice Updated' }),
    } as Response)
    const user = await updateUser('1', { name: 'Alice Updated' })
    expect(user.name).toBe('Alice Updated')
  })

  it('deletes a user', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    } as Response)
    const user = await deleteUser('1')
    expect(user).toEqual(mockUser)
  })

  it('fetches wishlist', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [mockWishlistItem],
    } as Response)
    const items = await getWishlist('1')
    expect(items).toEqual([mockWishlistItem])
  })

  it('adds wishlist item', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWishlistItem,
    } as Response)
    const item = await addWishlistItem('1', 'Book')
    expect(item).toEqual(mockWishlistItem)
  })

  it('removes wishlist item', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWishlistItem,
    } as Response)
    const item = await removeWishlistItem('1')
    expect(item).toEqual(mockWishlistItem)
  })
})
