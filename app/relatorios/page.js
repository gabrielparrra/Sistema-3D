import prisma from "@/app/lib/prisma";
import { createEvent, closeEvent } from "@/app/actions/events";
import { Plus, CheckCircle, BarChart2, Calendar } from "lucide-react";
import Link from "next/link";

export default async function RelatoriosPage() {
  const activeEvent = await prisma.event.findFirst({
    where: { isActive: true },
    include: {
      sales: {
        include: { items: true }
      }
    }
  });

  const closedEvents = await prisma.event.findMany({
    where: { isActive: false },
    orderBy: { closedAt: 'desc' },
    include: {
      sales: {
        include: { items: true }
      }
    }
  });

  return (
    <div className="fade-in">
      <header className="page-header">
        <h1 className="page-title">Relatórios e Eventos (Caixa)</h1>
      </header>

      <div className="grid-cards mb-8" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="glass glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 className="text-xl flex items-center gap-2"><Calendar /> Controle de Caixa</h2>
          
          {activeEvent ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
              <h3 className="text-success text-lg" style={{ fontWeight: 700 }}>{activeEvent.name}</h3>
              <p className="text-sm mt-1">Aberto em: {new Date(activeEvent.createdAt).toLocaleString()}</p>
              <div className="mt-4">
                <span className="text-2xl" style={{ fontWeight: 700 }}>
                  R$ {activeEvent.sales.reduce((acc, sale) => acc + sale.finalAmount, 0).toFixed(2)}
                </span>
                <span className="text-muted text-sm block">faturado até o momento</span>
              </div>

              <form action={async () => { "use server"; await closeEvent(activeEvent.id); }}>
                <button type="submit" className="btn btn-danger mt-6" style={{ width: '100%', padding: '12px' }}>
                  Encerrar Evento (Fechar Caixa)
                </button>
              </form>
            </div>
          ) : (
            <div style={{ background: 'rgba(37, 99, 235, 0.05)', padding: '16px', borderRadius: '12px' }}>
              <p className="text-muted text-sm mb-4">Nenhum evento ativo. Abra um evento para poder utilizar o PDV e registrar vendas.</p>
              <form action={createEvent} className="flex flex-col gap-4">
                <div className="input-group">
                  <input type="text" name="name" className="input-field" placeholder="Ex: Feira Anime, Novembro..." required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '12px' }}>
                  <Plus size={18} /> Abrir Novo Evento
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="glass glass-card">
          <h2 className="text-xl flex items-center gap-2 mb-4"><BarChart2 /> Relatórios Fechados</h2>
          
          {closedEvents.length === 0 ? (
            <p className="text-muted">Nenhum relatório de evento encerrado ainda.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {closedEvents.map(evt => {
                const total = evt.sales.reduce((acc, sale) => acc + sale.finalAmount, 0);
                const qtdItems = evt.sales.reduce((acc, sale) => acc + sale.items.reduce((sum, item) => sum + item.quantity, 0), 0);
                
                return (
                  <Link href={`/relatorios/${evt.id}`} key={evt.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s', border: '1px solid var(--surface-border)' }}>
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{evt.name}</h3>
                        <p className="text-sm text-muted">Fechado em: {new Date(evt.closedAt).toLocaleDateString()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="text-success" style={{ fontWeight: 700, fontSize: '1.25rem' }}>R$ {total.toFixed(2)}</div>
                        <div className="text-sm text-muted">{qtdItems} itens vendidos</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
