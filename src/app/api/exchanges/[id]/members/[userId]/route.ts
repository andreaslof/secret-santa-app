import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  const { id, userId } = await params

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  await prisma.member.delete({
    where: {
      userId_exchangeId: {
        userId,
        exchangeId: id,
      },
    },
  })
  return NextResponse.json({ deleted: true })
}
