import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const items = await prisma.wishlistItem.findMany({
    where: { userId: id },
  })
  return NextResponse.json(items)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await request.json()
  const item = await prisma.wishlistItem.create({
    data: {
      ...data,
      userId: id,
    },
  })
  return NextResponse.json(item, { status: 201 })
}
