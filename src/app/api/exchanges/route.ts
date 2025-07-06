import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const exchanges = await prisma.exchange.findMany()
  return NextResponse.json(exchanges)
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  const exchange = await prisma.exchange.create({ data })
  return NextResponse.json(exchange, { status: 201 })
}
