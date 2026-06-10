import prisma from "@/app/lib/prisma";

export default async function HistoricoPage() {
  const sales = await prisma.sale.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="fade-in">
      <header className="page-header">
        <h1 className="page-title">Histórico de Vendas</h1>
      </header>

      <div className="glass glass-card">
        {sales.length === 0 ? (
          <p className="text-muted">Nenhuma venda registrada ainda.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Itens</th>
                  <th>Subtotal</th>
                  <th>Desconto</th>
                  <th>Total Pago</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id}>
                    <td>
                      {new Date(sale.createdAt).toLocaleDateString("pt-BR", {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        {sale.items.map(item => (
                          <li key={item.id} className="text-sm">
                            {item.quantity}x {item.product.name} (R$ {item.price.toFixed(2)})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>R$ {sale.totalAmount.toFixed(2)}</td>
                    <td className="text-danger">R$ {sale.discount.toFixed(2)}</td>
                    <td className="text-success" style={{ fontWeight: 700 }}>R$ {sale.finalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
