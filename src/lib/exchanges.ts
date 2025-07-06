import { Exchange, Prisma } from '@/app/generated/prisma'
import { getBaseUrl } from './config'

type AssignmentWithUsers = Prisma.AssignmentGetPayload<{
  include: { giver: true; receiver: true }
}>

type AssignmentReceiver = Prisma.AssignmentGetPayload<{
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
  return res.json() as Promise<Exchange[]>
}

export async function createExchange(data: Partial<Exchange>): Promise<Exchange> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  return res.json() as Promise<Exchange>
}

export async function getExchangeById(id: string): Promise<Exchange> {
  const res = await fetch(`${BASE_URL}/${id}`)
  return res.json() as Promise<Exchange>
}

export async function updateExchange(id: string, data: Partial<Exchange>): Promise<Exchange> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  return res.json() as Promise<Exchange>
}

export async function deleteExchange(id: string): Promise<DeleteExchangeResponse> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  return res.json() as Promise<DeleteExchangeResponse>
}

export async function getAssignments(exchangeId: string): Promise<AssignmentWithUsers[]> {
  const res = await fetch(`${BASE_URL}/${exchangeId}/assignments`)
  return res.json() as Promise<AssignmentWithUsers[]>
}

export async function getReceiverForUser(
  exchangeId: string,
  userId: string,
): Promise<AssignmentReceiver> {
  const res = await fetch(`${BASE_URL}/${exchangeId}/assignments/${userId}`)
  return res.json() as Promise<AssignmentReceiver>
}

export async function generateMatches(exchangeId: string): Promise<CreatedAssignmentsResponse> {
  const res = await fetch(`${BASE_URL}/${exchangeId}/generate-matches`, { method: 'POST' })
  return res.json() as Promise<CreatedAssignmentsResponse>
}

export async function getMembers(exchangeId: string): Promise<MemberWithUser[]> {
  const res = await fetch(`${BASE_URL}/${exchangeId}/members`)
  return res.json() as Promise<MemberWithUser[]>
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
  return res.json() as Promise<AddedMembersResponse>
}

export async function removeMember(
  exchangeId: string,
  userId: string,
): Promise<RemovedMemberResponse> {
  const res = await fetch(`${BASE_URL}/${exchangeId}/members/${userId}`, { method: 'DELETE' })
  return res.json() as Promise<RemovedMemberResponse>
}
