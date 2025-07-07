import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> },
) {
  const { id, memberId } = await params
  const assignment = await prisma.assignment.findFirst({
    where: {
      exchangeId: id,
      AND: [
        {
          OR: [
            { giverId: memberId },
            { receiverId: memberId },
          ]
        }
      ]
    },
    include: {
      receiver: true,
      giver: true,
    },
  })

  if (!assignment) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
  }

  return NextResponse.json(assignment.receiver)
}
