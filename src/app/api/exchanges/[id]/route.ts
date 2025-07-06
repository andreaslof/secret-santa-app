import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const exchange = await prisma.exchange.findUnique({ where: { id } })
  if (!exchange) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(exchange)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await request.json()
  const exchange = await prisma.exchange.update({ where: { id }, data })
  return NextResponse.json(exchange)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.exchange.delete({ where: { id } })
  return NextResponse.json({ deleted: true })
}
