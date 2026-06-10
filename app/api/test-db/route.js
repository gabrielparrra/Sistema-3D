import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      return NextResponse.json({ error: "DATABASE_URL is not set!" });
    }
    
    // Tentativa simples de count
    const count = await prisma.category.count();
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connected successfully!", 
      categoriesCount: count,
      urlPrefix: url.substring(0, 15) + "..."
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack,
      name: error.name
    }, { status: 500 });
  }
}
