'use client'

import type { MemberWithUser } from '@/lib/exchanges'
import type { User } from '@/app/generated/prisma'

interface Props {
  members: MemberWithUser[]
  allUsers: User[]
  handleAddAction: (userId: string) => void
  handleRemoveAction: (userId: string) => void
}

export default function ExchangeMembers({ members, allUsers, handleAddAction, handleRemoveAction }: Props) {
  return (
    <div className="w-full mt-6" data-testid="exchange-members">
      <h2 className="text-lg font-medium mb-2">Members</h2>
      <ul className="w-full mb-4" data-testid="members-list">
        {members.map(({ userId, user }) => (
          <li key={userId} className="flex justify-between items-center py-1 mb-1 border-b border-b-black/10">
            <span data-testid="added-member">
              {user?.name || userId} ({user.email})
            </span>
            <button
              onClick={() => handleRemoveAction(userId)}
              className="text-red-600 text-sm cursor-pointer"
              data-testid="remove-member-btn"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <select
        className="border p-2 mr-2"
        onChange={(e) => handleAddAction(e.target.value)}
        data-testid="available-members"
        value=""
      >
        <option value="">
          Add member...
        </option>
        {allUsers
          .filter((u) => !members.some((m) => m.userId === u.id))
          .map((user) => (
            <option key={user.id} value={user.id} data-testid="available-member">
              {user.name} ({user.email})
            </option>
          ))}
      </select>
    </div>
  )
}
