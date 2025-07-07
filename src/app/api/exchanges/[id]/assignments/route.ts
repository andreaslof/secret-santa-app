import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const assignments = await prisma.assignment.findMany({
    where: { exchangeId: id },
    include: {
      giver: {
        include: { user: true },
      },
      receiver: {
        include: { user: true },
      },
    },
  })
  return NextResponse.json(assignments)
}
