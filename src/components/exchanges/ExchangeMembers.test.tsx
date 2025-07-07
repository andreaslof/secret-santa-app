import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cleanup, render, screen, waitFor, fireEvent } from '@testing-library/react'
import ExchangeMembers from '@/components/exchanges/ExchangeMembers'
import { type MemberWithUser } from '@/lib/exchanges'
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
  })

  it('renders initial members', async () => {
    render(
      <ExchangeMembers
        members={mockMembers}
        allUsers={mockUsers}
        handleAddAction={vi.fn()}
        handleRemoveAction={vi.fn()}
      />
    )

    // Wait for users to be fetched and the member list to be rendered
    await waitFor(() => {
      const members = screen.getAllByTestId('added-member')
      expect(members).toHaveLength(1) // We expect 1 member initially (Alice)
      expect(members[0].textContent).toContain('Alice') // Check that Alice is in the text
      expect(members[0].textContent).toContain('alice@example.com') // Check that Alice's email is there
    })
  })

  it('adds a user when selected from dropdown', async () => {
    const handleAddAction = vi.fn()

    render(
      <ExchangeMembers
        members={mockMembers}
        allUsers={mockUsers}
        handleAddAction={handleAddAction}
        handleRemoveAction={vi.fn()}
      />
    )

    // Wait for the dropdown to be populated
    await waitFor(() => {
      const select = screen.getByTestId('available-members')
      fireEvent.change(select, { target: { value: 'user-2' } }) // Select Bob
    })

    // Check if handleAddAction was called with the correct userId
    await waitFor(() => {
      expect(handleAddAction).toHaveBeenCalledWith('user-2')
    })
  })

  it('removes a user when clicking remove', async () => {
    const handleRemoveAction = vi.fn()

    render(
      <ExchangeMembers
        members={mockMembers}
        allUsers={mockUsers}
        handleAddAction={vi.fn()}
        handleRemoveAction={handleRemoveAction}
      />
    )

    // Wait for members to be displayed
    await waitFor(() => {
      const members = screen.getAllByTestId('added-member')
      expect(members).toHaveLength(1) // Ensure one member is present
    })

    const removeButton = screen.getAllByTestId('remove-member-btn').at(0)!
    fireEvent.click(removeButton)

    // Check if handleRemoveAction was called with the correct userId
    await waitFor(() => {
      expect(handleRemoveAction).toHaveBeenCalledWith('user-1')
    })
  })
})

