import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  // Fix for Next.js 15+ async params
  const { filename } = await params;
  
  let filePath = path.join(process.cwd(), 'uploads', filename);

  try {
    if (!fs.existsSync(filePath)) {
      // Fallback para a pasta antiga
      filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      if (!fs.existsSync(filePath)) {
        return new Response("Not found", { status: 404 });
      }
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache control para garantir performance (1 ano já que os nomes são únicos)
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
