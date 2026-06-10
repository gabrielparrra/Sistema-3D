import prisma from "@/app/lib/prisma";
import * as xlsx from "xlsx";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { name: 'asc' }
    });

    const data = products.map(p => ({
      'Código': p.code || '',
      'Nome': p.name || '',
      'Categoria': p.category?.name || '',
      'Custo': p.cost || 0,
      'Preço': p.price || 0,
      'Estoque': p.stock || 0,
      'Descrição': p.description || ''
    }));

    // Create a new workbook and worksheet
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Produtos");

    // Generate buffer
    const buf = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="produtos_hiperfoco.xlsx"'
      }
    });
  } catch (error) {
    return new Response("Erro ao exportar produtos", { status: 500 });
  }
}
