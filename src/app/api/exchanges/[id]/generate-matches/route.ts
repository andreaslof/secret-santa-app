import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function generateUniqueCircularAssignments(members: { id: string }[]) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const shuffled = shuffleArray(members)
    const assignments = shuffled.map((giver, i) => ({
      giverId: giver.id,
      receiverId: shuffled[(i + 1) % shuffled.length].id,
    }))
    const hasDuplicates = assignments.some((a) => a.giverId === a.receiverId)
    if (!hasDuplicates) return assignments
  }
  throw new Error('Failed to generate unique assignments after multiple attempts')
}

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const members = await prisma.member.findMany({ where: { exchangeId: id } })

  if (members.length < 2) {
    return NextResponse.json({ error: 'Not enough participants' }, { status: 400 })
  }

  let assignments: { giverId: string; receiverId: string; exchangeId: string }[]
  try {
    assignments = generateUniqueCircularAssignments(members).map((a) => ({
      ...a,
      exchangeId: id,
    }))
  } catch (error) {
    console.error({ error })
    return NextResponse.json({ error: 'Unable to generate valid assignments' }, { status: 500 })
  }

  await prisma.assignment.deleteMany({ where: { exchangeId: id } })
  const created = await prisma.assignment.createMany({ data: assignments })

  return NextResponse.json({ created: created.count })
}
