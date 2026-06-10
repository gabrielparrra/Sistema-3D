import prisma from "@/app/lib/prisma";
import * as xlsx from "xlsx";

export async function GET(request, { params }) {
  // Fix Next.js 15+ async params
  const { eventId } = await params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        sales: {
          include: {
            items: {
              include: { product: true }
            }
          }
        }
      }
    });

    if (!event) return new Response("Evento não encontrado", { status: 404 });

    const data = [];
    
    for (const sale of event.sales) {
      const dateStr = new Date(sale.createdAt).toLocaleString('pt-BR');
      for (const item of sale.items) {
        data.push({
          'ID Venda': sale.id,
          'Data Hora': dateStr,
          'Código Produto': item.product?.code || '',
          'Nome Produto': item.product?.name || '',
          'Quantidade': item.quantity,
          'Preço Unitário': item.price,
          'Total Item': item.quantity * item.price,
          'Método Pagamento': sale.paymentMethod || ''
        });
      }
    }

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Vendas");

    const buf = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    const safeName = (event.name || 'evento').replace(/[^a-z0-9]/gi, '_').toLowerCase();

    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="vendas_${safeName}.xlsx"`
      }
    });
  } catch (error) {
    return new Response("Erro ao exportar vendas", { status: 500 });
  }
}
