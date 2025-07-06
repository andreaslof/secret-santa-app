import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  const { id, userId } = await params
  const assignment = await prisma.assignment.findFirst({
    where: {
      exchangeId: id,
      giverId: userId,
    },
    include: {
      receiver: true,
    },
  })

  if (!assignment) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
  }

  return NextResponse.json(assignment.receiver)
}
