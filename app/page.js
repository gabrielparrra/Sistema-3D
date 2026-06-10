import { Box, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import prisma from "./lib/prisma";

export default async function Dashboard() {
  // Busca o resumo das vendas e produtos
  const [sales, productsCount, categoriesCount, lowStockProducts] = await Promise.all([
    prisma.sale.findMany(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.findMany({
      where: { stock: { lte: 2 } },
      orderBy: { stock: 'asc' },
      include: { category: true }
    })
  ]);

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.finalAmount, 0);
  const totalSales = sales.length;

  return (
    <div className="fade-in">
      <header className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </header>

      <div className="grid-cards mb-8">
        <div className="glass glass-card flex items-center justify-between">
          <div>
            <h3 className="text-sm">Faturamento Total</h3>
            <p className="text-2xl mt-2" style={{ fontWeight: 700 }}>R$ {totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-full" style={{ background: "rgba(59,130,246,0.1)" }}>
            <DollarSign color="#3b82f6" size={32} />
          </div>
        </div>

        <div className="glass glass-card flex items-center justify-between">
          <div>
            <h3 className="text-sm">Vendas Realizadas</h3>
            <p className="text-2xl mt-2" style={{ fontWeight: 700 }}>{totalSales}</p>
          </div>
          <div className="p-3 rounded-full" style={{ background: "rgba(16,185,129,0.1)" }}>
            <ShoppingCart color="#10b981" size={32} />
          </div>
        </div>

        <div className="glass glass-card flex items-center justify-between">
          <div>
            <h3 className="text-sm">Produtos Cadastrados</h3>
            <p className="text-2xl mt-2" style={{ fontWeight: 700 }}>{productsCount}</p>
          </div>
          <div className="p-3 rounded-full" style={{ background: "rgba(139,92,246,0.1)" }}>
            <Box color="#8b5cf6" size={32} />
          </div>
        </div>
      </div>

      <div className="grid-cards mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        
        {/* Fila de Produção */}
        <div className="glass glass-card" style={{ borderTop: '4px solid #ef4444' }}>
          <h2 className="text-2xl mb-4 flex items-center gap-2 text-danger">
            Fila de Produção (Estoque Crítico)
          </h2>
          <p className="text-muted mb-4">Produtos com 2 ou menos unidades no estoque, prontos para a impressora 3D.</p>
          
          {lowStockProducts.length === 0 ? (
            <div className="p-4" style={{ background: 'rgba(16,185,129,0.1)', borderRadius: '8px', color: '#059669', fontWeight: 600 }}>
              🎉 Tudo em ordem! Nenhum produto com estoque crítico no momento.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3" style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    <div className="text-sm text-muted">{p.category?.name} {p.code ? `(${p.code})` : ''}</div>
                  </div>
                  <div style={{ padding: '4px 12px', background: p.stock === 0 ? '#fee2e2' : '#fef3c7', color: p.stock === 0 ? '#ef4444' : '#d97706', borderRadius: '16px', fontWeight: 700 }}>
                    {p.stock} uni
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="glass glass-card" style={{ height: 'fit-content' }}>
          <h2 className="text-2xl mb-4">Bem-vindo ao Hiperfoco 3D!</h2>
          <p className="text-muted">Utilize o menu superior para gerenciar suas categorias, produtos e registrar novas vendas no PDV.</p>
        </div>

      </div>

    </div>
  );
}
