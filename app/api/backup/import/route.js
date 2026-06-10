import { NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import prisma from '@/app/lib/prisma';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse the zip
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();

    // Disconnect Prisma so SQLite releases the file lock
    await prisma.$disconnect();

    // Delay briefly to ensure lock is released by the OS
    await new Promise(resolve => setTimeout(resolve, 500));

    let dbRestored = false;
    const uploadsPath = path.join(process.cwd(), 'public', 'uploads');

    // Create uploads folder if not exists
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }

    zipEntries.forEach(entry => {
      // Restore Database
      if (entry.entryName === 'prisma/dev.db' || entry.entryName === 'dev.db') {
        const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
        fs.writeFileSync(dbPath, entry.getData());
        dbRestored = true;
      }
      
      // Restore Uploads
      if (entry.entryName.startsWith('uploads/') && !entry.isDirectory) {
        const fileName = entry.entryName.replace('uploads/', '');
        const targetPath = path.join(uploadsPath, fileName);
        fs.writeFileSync(targetPath, entry.getData());
      }
    });

    if (!dbRestored) {
      return NextResponse.json({ error: "O arquivo enviado não contém um banco de dados válido (dev.db)." }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Backup restaurado com sucesso. Reinicie o sistema se necessário." });

  } catch (error) {
    console.error("Backup import error:", error);
    return NextResponse.json({ error: "Erro ao restaurar backup. O arquivo pode estar corrompido ou bloqueado." }, { status: 500 });
  }
}
