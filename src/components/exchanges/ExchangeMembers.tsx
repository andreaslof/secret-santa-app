'use client'

import { useState, useEffect } from 'react'
import { addMembers, removeMember, getMembers } from '@/lib/exchanges'
import { getAllUsers } from '@/lib/users'
import type { MemberWithUser } from '@/lib/exchanges'
import { User } from '@/app/generated/prisma'

interface Props {
  exchangeId: string
  initialMembers: MemberWithUser[]
}

export default function ExchangeMembers({ exchangeId, initialMembers }: Props) {
  const [members, setMembers] = useState<MemberWithUser[]>(initialMembers)
  const [allUsers, setAllUsers] = useState<User[]>([])

  useEffect(() => {
    getAllUsers().then(setAllUsers)
  }, [])

  const handleAdd = async (userId: string) => {
    await addMembers(exchangeId, [userId])
    const updated = await getMembers(exchangeId)
    setMembers(updated)
  }

  const handleRemove = async (userId: string) => {
    await removeMember(exchangeId, userId)
    setMembers((prev) => prev.filter((m) => m.userId !== userId))
  }

  return (
    <div className="w-full mt-6" data-testid="exchange-members">
      <h2 className="text-lg font-medium mb-2">Members</h2>
      <ul className="mb-4" data-testid="members-list">
        {members.map(({ userId, user }) => (
          <li key={userId} className="flex justify-between items-center py-1">
            <span data-testid="added-member">
              {user?.name || userId} ({user.email} - {user.id})
            </span>
            <button
              onClick={() => handleRemove(userId)}
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
        onChange={(e) => handleAdd(e.target.value)}
        data-testid="available-members"
      >
        <option value="" disabled>
          Add member...
        </option>
        {allUsers
          .filter((u) => !members.some((m) => m.userId === u.id))
          .map((user) => (
            <option key={user.id} value={user.id} data-testid="available-member">
              {user.name} ({user.email} - {user.id})
            </option>
          ))}
      </select>
    </div>
  )
}
