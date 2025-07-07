import { User, WishlistItem } from '@/app/generated/prisma'
import { getBaseUrl } from './config'
import { handleResponse } from './api-helpers'

const BASE_URL = `${getBaseUrl()}/api/users`

export async function getAllUsers(): Promise<User[]> {
  const res = await fetch(BASE_URL)
  return handleResponse<User[]>(res)
}

export async function getUserById(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/${id}`)
  return handleResponse<User>(res)
}

export async function createUser(data: Pick<User, 'name' | 'email'>): Promise<User> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<User>(res)
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
  return handleResponse<User>(res)
}

export async function deleteUser(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  return handleResponse<User>(res)
}

export async function getWishlist(userId: string): Promise<WishlistItem[]> {
  const res = await fetch(`${BASE_URL}/${userId}/wishlist`)
  return handleResponse<WishlistItem[]>(res)
}

export async function addWishlistItem(userId: string, label: string): Promise<WishlistItem> {
  const res = await fetch(`${BASE_URL}/${userId}/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  })
  return handleResponse<WishlistItem>(res)
}

export async function removeWishlistItem(id: string): Promise<WishlistItem> {
  const res = await fetch(`${BASE_URL}/wishlist/${id}`, {
    method: 'DELETE',
  })
  return handleResponse<WishlistItem>(res)
}
