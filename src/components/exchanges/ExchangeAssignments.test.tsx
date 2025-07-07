import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react'
import ExchangeAssignments from '@/components/exchanges/ExchangeAssignments'
import { AssignmentWithUsers } from '@/lib/exchanges'

const mockAssignments: AssignmentWithUsers[] = [
  {
    id: 'assignment-1',
    exchangeId: 'exchange-1',
    giverId: 'user-1',
    receiverId: 'user-2',
    selectedWishlistItemId: null,
    customGiftTitle: null,
    customGiftUrl: null,
    giftGivenAt: null,
    createdAt: new Date(),
    giver: {
      id: 'user-1',
      exchangeId: 'exchange-1',
      userId: 'user-1',
      createdAt: new Date(),
      user: {
        id: 'user-1',
        name: 'Alice',
        email: 'alice@example.com',
        createdAt: new Date(),
      },
    },
    receiver: {
      id: 'user-2',
      exchangeId: 'exchange-1',
      userId: 'user-2',
      createdAt: new Date(),
      user: {
        id: 'user-2',
        name: 'Bob',
        email: 'bob@example.com',
        createdAt: new Date(),
      },
    },
  },
  {
    id: 'assignment-2',
    exchangeId: 'exchange-2',
    giverId: 'user-3',
    receiverId: 'user-4',
    selectedWishlistItemId: null,
    customGiftTitle: null,
    customGiftUrl: null,
    giftGivenAt: null,
    createdAt: new Date(),
    giver: {
      id: 'user-3',
      exchangeId: 'exchange-2',
      userId: 'user-3',
      createdAt: new Date(),
      user: {
        id: 'user-3',
        name: 'Charlie',
        email: 'charlie@example.com',
        createdAt: new Date(),
      },
    },
    receiver: {
      id: 'user-4',
      exchangeId: 'exchange-2',
      userId: 'user-4',
      createdAt: new Date(),
      user: {
        id: 'user-4',
        name: 'Dave',
        email: 'dave@example.com',
        createdAt: new Date(),
      },
    },
  },
]


describe('ExchangeAssignments', () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders assignments list when assignments are provided', async () => {
    render(
      <ExchangeAssignments
        assignments={mockAssignments}
        handleGenerateMatchesAction={vi.fn()}
        canGenerate={true}
      />
    )

    const assignments = screen.getAllByTestId('assignments-list')
    expect(assignments.length).toBe(1)
    const assignmentItems = screen.getAllByText(/gives to/i)
    expect(assignmentItems.length).toBe(2)
  })

  it('displays "No assignments found" when no assignments are provided', async () => {
    render(
      <ExchangeAssignments
        assignments={[]}
        handleGenerateMatchesAction={vi.fn()}
        canGenerate={true}
      />
    )

    const noAssignmentsText = screen.queryByText('No assignments found.')
    expect(noAssignmentsText).not.toBeNull()
  })

  it('calls handleGenerateMatchesAction when the button is clicked', async () => {
    const handleGenerateMatchesAction = vi.fn()

    render(
      <ExchangeAssignments
        assignments={mockAssignments}
        handleGenerateMatchesAction={handleGenerateMatchesAction}
        canGenerate={true}
      />
    )

    const generateButton = screen.getByText('Generate matches')
    const disabledAttr = generateButton.getAttribute('disabled')
    expect(disabledAttr).toBeNull()

    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(handleGenerateMatchesAction).toHaveBeenCalledTimes(1)
    })
  })

  it('does not call handleGenerateMatchesAction when the button is clicked and canGenerate is false', async () => {
    const handleGenerateMatchesAction = vi.fn()

    render(
      <ExchangeAssignments
        assignments={mockAssignments}
        handleGenerateMatchesAction={handleGenerateMatchesAction}
        canGenerate={false}
      />
    )

    const generateButton = screen.getByText('Generate matches')

    const disabledAttr = generateButton.getAttribute('disabled')
    expect(disabledAttr).not.toBeNull()

    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(handleGenerateMatchesAction).toHaveBeenCalledTimes(0)
    })
  })
})
