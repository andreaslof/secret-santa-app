import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getExchangeById,
  getAllExchanges,
  createExchange,
  updateExchange,
  deleteExchange,
  addMembers,
  getMembers,
  generateMatches,
  getReceiverForUser,
  getAssignments,
} from '../lib/exchanges'

const fetchMock = vi.fn()

global.fetch = fetchMock

describe('lib/exchanges.ts', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('getAllExchanges returns exchange list', async () => {
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve([{ id: 'ex1' }]) })
    const result = await getAllExchanges()
    expect(result).toEqual([{ id: 'ex1' }])
  })

  it('createExchange posts and returns exchange', async () => {
    const data = { name: 'New Exchange' }
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ id: 'ex2', ...data }) })
    const result = await createExchange(data)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/exchanges',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(result).toEqual({ id: 'ex2', ...data })
  })

  it('getExchangeById returns specific exchange', async () => {
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ id: 'ex3' }) })
    const result = await getExchangeById('ex3')
    expect(result).toEqual({ id: 'ex3' })
  })

  it('updateExchange patches and returns updated exchange', async () => {
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ id: 'ex4', name: 'Updated' }) })
    const result = await updateExchange('ex4', { name: 'Updated' })
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/exchanges/ex4',
      expect.objectContaining({ method: 'PATCH' }),
    )
    expect(result.name).toBe('Updated')
  })

  it('deleteExchange removes exchange', async () => {
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ deleted: true }) })
    const result = await deleteExchange('ex5')
    expect(result).toEqual({ deleted: true })
  })

  it('getAssignments returns assignments with users', async () => {
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: 'a1', giver: {}, receiver: {} }]),
    })
    const result = await getAssignments('ex1')
    expect(result[0]).toHaveProperty('giver')
    expect(result[0]).toHaveProperty('receiver')
  })

  it('getReceiverForUser returns receiver for user', async () => {
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ id: 'u2' }) })
    const result = await getReceiverForUser('ex1', 'u1')
    expect(result).toEqual({ id: 'u2' })
  })

  it('generateMatches creates assignments', async () => {
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ created: 5 }) })
    const result = await generateMatches('ex1')
    expect(result).toEqual({ created: 5 })
  })

  it('getMembers returns members with user info', async () => {
    fetchMock.mockResolvedValueOnce({
      json: () => Promise.resolve([{ id: 'm1', user: { id: 'u1' } }]),
    })
    const result = await getMembers('ex1')
    expect(result[0]).toHaveProperty('user')
  })

  it('addMembers returns created count', async () => {
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ created: 3 }) })
    const result = await addMembers('ex1', ['u1', 'u2', 'u3'])
    expect(result).toEqual({ created: 3 })
  })
})
