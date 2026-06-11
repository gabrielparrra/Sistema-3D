import { prisma } from "@/app/lib/prisma";
import POS from "../components/POS";
import Link from "next/link";

export default async function VendasPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    include: { category: true }
  });

  const activeEvent = await prisma.event.findFirst({
    where: { isActive: true }
  });

  return (
    <div className="fade-in">
      <header className="page-header flex justify-between items-center">
        <h1 className="page-title">Ponto de Venda (PDV)</h1>
        {activeEvent && (
          <div style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb', padding: '8px 16px', borderRadius: '8px', fontWeight: 600 }}>
            Caixa: {activeEvent.name}
          </div>
        )}
      </header>
      
      {!activeEvent ? (
        <div className="glass glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h2 className="text-2xl text-danger mb-4">Nenhum Caixa / Evento Aberto</h2>
          <p className="text-muted mb-6 max-w-md mx-auto">
            Para registrar vendas, você precisa abrir um evento primeiro (ex: "Vendas de Novembro", "Feira XPTO"). Isso garante que suas vendas sejam contabilizadas no relatório correto.
          </p>
          <Link href="/relatorios" className="btn btn-primary" style={{ display: 'inline-flex', padding: '12px 24px' }}>
            Ir para Relatórios e Abrir Evento
          </Link>
        </div>
      ) : (
        <POS products={products} />
      )}
    </div>
  );
}
