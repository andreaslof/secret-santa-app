import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const members = await prisma.member.findMany({
    where: { exchangeId: id },
    include: { user: true },
  })
  return NextResponse.json(members)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userIds }: { userIds: string[] } = await request.json()

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return NextResponse.json({ error: 'Missing userIds array' }, { status: 400 })
  }

  const members = userIds.map((userId) => ({ userId, exchangeId: id }))

  const created = await prisma.member.createMany({ data: members, skipDuplicates: true })
  return NextResponse.json({ created: created.count })
}
