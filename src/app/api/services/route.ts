import { NextRequest, NextResponse } from 'next/server';

// Service model does not exist in schema.prisma
// Stubbing this file to pass build

export async function GET(request: NextRequest) {
  return NextResponse.json([]);
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
