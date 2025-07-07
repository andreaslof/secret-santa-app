'use client'

import { useState, useEffect, useCallback } from 'react'
import { addMembers, removeMember, getMembers, getAssignments, generateMatches } from '@/lib/exchanges'
import type { AssignmentWithUsers, MemberWithUser } from '@/lib/exchanges'
import { User } from '@/app/generated/prisma'
import ExchangeMembers from './ExchangeMembers'
import ExchangeAssignments from './ExchangeAssignments'

interface Props {
  exchangeId: string
  initialMembers: MemberWithUser[]
  initialAssignments: AssignmentWithUsers[]
  allUsers: User[]
}

export default function ExchangeMembersAssignmentsContainer({ exchangeId, initialMembers, initialAssignments, allUsers }: Props) {
  const [members, setMembers] = useState<MemberWithUser[]>(initialMembers)
  const [assignments, setAssignments] = useState<AssignmentWithUsers[]>(initialAssignments)
  const [canGenerate, setCanGenerate] = useState(members.length > 1)

  useEffect(() => {
    setCanGenerate(members.length > 1)
  }, [members])

  const fetchAssignments = useCallback(async () => {
    const assignments = await getAssignments(exchangeId)
    setAssignments(assignments)
  }, [exchangeId])

  const handleAdd = useCallback(async (userId: string) => {
    await addMembers(exchangeId, [userId])
    const updated = await getMembers(exchangeId)
    setMembers(updated)
  }, [exchangeId])

  const handleRemove = useCallback(async (userId: string) => {
    await removeMember(exchangeId, userId)
    await fetchAssignments()
    setMembers((prev) => prev.filter((m) => m.userId !== userId))
  }, [exchangeId, fetchAssignments])

  const handleGenerateMatches = useCallback(async () => {
    await generateMatches(exchangeId)
    await fetchAssignments()
  }, [exchangeId, fetchAssignments])

  return (
    <>
      <ExchangeMembers
        members={members}
        allUsers={allUsers}
        handleAddAction={handleAdd}
        handleRemoveAction={handleRemove}
      />
      <ExchangeAssignments
        assignments={assignments}
        canGenerate={canGenerate}
        handleGenerateMatchesAction={handleGenerateMatches}
      />
    </>
  )
}
