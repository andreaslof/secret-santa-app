import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cleanup, render, screen, waitFor, fireEvent } from '@testing-library/react'
import ExchangeMembers from '@/components/exchanges/ExchangeMembers'
import { type MemberWithUser } from '@/lib/exchanges'
import * as exchangesApi from '@/lib/exchanges'
import * as usersApi from '@/lib/users'
import { User } from '@/app/generated/prisma'

const mockMembers: MemberWithUser[] = [
  {
    id: 'member-1',
    userId: 'user-1',
    exchangeId: 'exchange-1',
    createdAt: new Date(),
    user: {
      id: 'user-1',
      name: 'Alice',
      email: 'alice@example.com',
      createdAt: new Date(),
    },
  },
]

const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice', email: 'alice@example.com', createdAt: new Date() },
  { id: 'user-2', name: 'Bob', email: 'bob@example.com', createdAt: new Date() },
]

describe('ExchangeMembers', () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()

    vi.spyOn(usersApi, 'getAllUsers').mockResolvedValue(mockUsers)
    vi.spyOn(exchangesApi, 'addMembers').mockResolvedValue({ created: 1 })
    vi.spyOn(exchangesApi, 'removeMember').mockResolvedValue({ deleted: true })
    vi.spyOn(exchangesApi, 'getMembers').mockResolvedValue([
      ...mockMembers,
      {
        id: 'member-2',
        exchangeId: 'ex-1',
        userId: 'user-2',
        createdAt: new Date(),
        user: { id: 'user-2', name: 'Bob', email: 'bob@example.com', createdAt: new Date() },
      },
    ])
  })

  it('renders initial members', async () => {
    render(<ExchangeMembers exchangeId="ex-1" initialMembers={mockMembers} />)

    // Wait for users to be fetched and the member list to be rendered
    await waitFor(() => {
      const members = screen.getAllByTestId('added-member')
      expect(members).toHaveLength(1) // We expect 1 member initially (Alice)
      expect(members[0].textContent).toContain('Alice') // Check that Alice is in the text
      expect(members[0].textContent).toContain('alice@example.com') // Check that Alice's email is there
    })
  })

  it('adds a user when selected from dropdown', async () => {
    render(<ExchangeMembers exchangeId="ex-1" initialMembers={mockMembers} />)

    // Wait for the dropdown to be populated
    await waitFor(() => {
      const select = screen.getByTestId('available-members')
      fireEvent.change(select, { target: { value: 'user-2' } }) // Select Bob
    })

    await waitFor(() => {
      const members = screen.getAllByTestId('added-member') // We expect the new member to show up
      expect(members).toHaveLength(2) // We should now have 2 members (Alice and Bob)
      expect(members[1].textContent).toContain('Bob') // Check that Bob was added
      expect(members[1].textContent).toContain('bob@example.com') // Check that Bob's email is there
    })
  })

  it('removes a user when clicking remove', async () => {
    render(<ExchangeMembers exchangeId="ex-1" initialMembers={mockMembers} />)

    // Wait for members to be displayed
    await waitFor(() => {
      const members = screen.getAllByTestId('added-member')
      expect(members).toHaveLength(1) // Ensure one member is present
    })

    const removeButton = screen.getAllByTestId('remove-member-btn').at(0)!
    fireEvent.click(removeButton)

    await waitFor(() => {
      const emptyList = screen.getByTestId('members-list')
      expect(emptyList.children.length).toBe(0)
    })
  })
})
