import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

export async function GET() {
  try {
    const zip = new AdmZip();

    // Export local sqlite database
    const dbPath = path.join(process.cwd(), 'dev.db');
    if (fs.existsSync(dbPath)) {
      zip.addLocalFile(dbPath, 'database');
    }

    // Add Uploads folder (images)
    const uploadsPath = path.join(process.cwd(), 'uploads');
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
