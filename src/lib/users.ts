import { User, WishlistItem } from '@/app/generated/prisma'
import { getBaseUrl } from './config'

const BASE_URL = `${getBaseUrl()}/api/users`

export async function getAllUsers(): Promise<User[]> {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export async function getUserById(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch user with ID ${id}`)
  return res.json()
}

export async function createUser(data: Pick<User, 'name' | 'email'>): Promise<User> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create user')
  return res.json()
}

export async function updateUser(
  id: string,
  data: Partial<Pick<User, 'name' | 'email'>>,
): Promise<User> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Failed to update user with ID ${id}`)
  return res.json()
}

export async function deleteUser(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(`Failed to delete user with ID ${id}`)
  return res.json()
}

export async function getWishlist(userId: string): Promise<WishlistItem[]> {
  const res = await fetch(`${BASE_URL}/${userId}/wishlist`)
  if (!res.ok) throw new Error(`Failed to fetch wishlist for user ID ${userId}`)
  return res.json()
}

export async function addWishlistItem(userId: string, label: string): Promise<WishlistItem> {
  const res = await fetch(`${BASE_URL}/${userId}/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  })
  if (!res.ok) throw new Error(`Failed to add wishlist item for user ID ${userId}`)
  return res.json()
}

export async function removeWishlistItem(id: string): Promise<WishlistItem> {
  const res = await fetch(`${BASE_URL}/wishlist/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(`Failed to remove wishlist item with ID ${id}`)
  return res.json()
}
