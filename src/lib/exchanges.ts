import { Exchange, Prisma } from '@/app/generated/prisma'
import { getBaseUrl } from './config'
import { handleResponse } from './api-helpers'

type AssignmentWithUsers = Prisma.AssignmentGetPayload<{
  include: { giver: true; receiver: true }
}>

export type AssignmentReceiver = Prisma.AssignmentGetPayload<{
  include: { receiver: true }
}>['receiver']

export type MemberWithUser = Prisma.MemberGetPayload<{
  include: { user: true }
}>

type DeleteExchangeResponse = { deleted: boolean }
type CreatedAssignmentsResponse = { created: number }
type AddedMembersResponse = { created: number }
type RemovedMemberResponse = { deleted: boolean }

const BASE_URL = `${getBaseUrl()}/api/exchanges`

export async function getAllExchanges(): Promise<Exchange[]> {
  const res = await fetch(BASE_URL)
  return handleResponse<Exchange[]>(res)
}

export async function createExchange(data: Partial<Exchange>): Promise<Exchange> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  return handleResponse<Exchange>(res)
}

export async function getExchangeById(id: string): Promise<Exchange> {
  const res = await fetch(`${BASE_URL}/${id}`)
  return handleResponse<Exchange>(res)
}

export async function updateExchange(id: string, data: Partial<Exchange>): Promise<Exchange> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  return handleResponse<Exchange>(res)
}

export async function deleteExchange(id: string): Promise<DeleteExchangeResponse> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  return handleResponse<DeleteExchangeResponse>(res)
}

export async function getAssignments(exchangeId: string): Promise<AssignmentWithUsers[]> {
  const res = await fetch(`${BASE_URL}/${exchangeId}/assignments`)
  return handleResponse<AssignmentWithUsers[]>(res)
}

export async function getReceiverForUser(
  exchangeId: string,
  userId: string,
): Promise<AssignmentReceiver> {
  const res = await fetch(`${BASE_URL}/${exchangeId}/assignments/${userId}`)
  return handleResponse<AssignmentReceiver>(res)
}

export async function generateMatches(exchangeId: string): Promise<CreatedAssignmentsResponse> {
  const res = await fetch(`${BASE_URL}/${exchangeId}/generate-matches`, { method: 'POST' })
  return handleResponse<CreatedAssignmentsResponse>(res)
}

export async function getMembers(exchangeId: string): Promise<MemberWithUser[]> {
  const res = await fetch(`${BASE_URL}/${exchangeId}/members`)
  return handleResponse<MemberWithUser[]>(res)
}

export async function addMembers(
  exchangeId: string,
  userIds: string[],
): Promise<AddedMembersResponse> {
  const res = await fetch(`${BASE_URL}/${exchangeId}/members`, {
    method: 'POST',
    body: JSON.stringify({ userIds }),
    headers: { 'Content-Type': 'application/json' },
  })
  return handleResponse<AddedMembersResponse>(res)
}

export async function removeMember(
  exchangeId: string,
  userId: string,
): Promise<RemovedMemberResponse> {
  const res = await fetch(`${BASE_URL}/${exchangeId}/members/${userId}`, { method: 'DELETE' })
  return handleResponse<RemovedMemberResponse>(res)
}
