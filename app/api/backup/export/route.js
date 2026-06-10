import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const zip = new AdmZip();

    // 1. Add Database file
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    if (fs.existsSync(dbPath)) {
      zip.addLocalFile(dbPath, 'prisma');
    }

    // 2. Add Uploads folder (images)
    const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
    if (fs.existsSync(uploadsPath)) {
      zip.addLocalFolder(uploadsPath, 'uploads');
    }

    // Generate zip buffer
    const zipBuffer = zip.toBuffer();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="backup_hiperfoco_${timestamp}.zip"`
      }
    });

  } catch (error) {
    console.error("Backup export error:", error);
    return new Response("Erro ao gerar backup.", { status: 500 });
  }
}
