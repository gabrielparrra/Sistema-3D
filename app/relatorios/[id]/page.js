import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { redirect } from "next/navigation";

export default async function RelatorioDetalhePage({ params }) {
  const { id } = await params;
  
  const event = await prisma.event.findUnique({
    where: { id },
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

  if (!event) redirect("/relatorios");

  const totalAmount = event.sales.reduce((acc, s) => acc + s.finalAmount, 0);
  const totalItems = event.sales.reduce((acc, s) => acc + s.items.reduce((sum, item) => sum + item.quantity, 0), 0);
  
  // Calculate top products
  const productCount = {};
  event.sales.forEach(sale => {
    sale.items.forEach(item => {
      const name = item.product.name;
      productCount[name] = (productCount[name] || 0) + item.quantity;
    });
  });
  const topProducts = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="fade-in">
      <header className="page-header">
        <div className="flex items-center gap-4">
          <Link href="/relatorios" className="btn btn-secondary" style={{ padding: '8px' }}>
            <ArrowLeft size={20} />
          </Link>
          <div style={{ flex: 1 }}>
            <h1 className="page-title">{event.name}</h1>
            <p className="text-muted text-sm mt-1">
              {new Date(event.createdAt).toLocaleDateString()} até {event.closedAt ? new Date(event.closedAt).toLocaleDateString() : 'Aberto'}
            </p>
          </div>
          <a href={`/api/export/sales/${event.id}`} target="_blank" className="btn" style={{ background: '#8b5cf6', color: 'white' }}>
            <Download size={18} /> Exportar Vendas (.xlsx)
          </a>
        </div>
      </header>

      <div className="grid-cards mb-8">
        <div className="glass glass-card">
          <h2 className="text-xl mb-4">Resumo do Evento</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between" style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px' }}>
              <span className="text-muted">Total Faturado</span>
              <span className="text-success" style={{ fontWeight: 700, fontSize: '1.25rem' }}>R$ {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '8px' }}>
              <span className="text-muted">Quantidade de Vendas</span>
              <span style={{ fontWeight: 600 }}>{event.sales.length} vendas</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Itens Vendidos</span>
              <span style={{ fontWeight: 600 }}>{totalItems} itens</span>
            </div>
          </div>
        </div>

        <div className="glass glass-card">
          <h2 className="text-xl mb-4">Top 5 Produtos Mais Vendidos</h2>
          {topProducts.length === 0 ? (
            <p className="text-muted">Nenhum produto vendido.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topProducts.map(([name, qty], index) => (
                <li key={name} className="flex justify-between items-center" style={{ background: 'rgba(0,0,0,0.05)', padding: '12px', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{index + 1}. {name}</span>
                  <span className="text-primary" style={{ fontWeight: 700 }}>{qty} un</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
