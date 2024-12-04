import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        user: { email: session.user?.email }
      },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching invoices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email }
    });

    const invoice = await prisma.invoice.create({
      data: {
        description: json.description,
        amount: json.amount,
        date: new Date(json.date),
        userId: user!.id
      }
    });
    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating invoice' }, { status: 500 });
  }
}