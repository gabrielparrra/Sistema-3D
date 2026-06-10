import prisma from "@/app/lib/prisma";
import { createCategory, deleteCategory } from "../actions/categories";
import { Trash2 } from "lucide-react";
import DeleteButton from "../components/DeleteButton";

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="fade-in">
      <header className="page-header">
        <h1 className="page-title">Categorias</h1>
      </header>

      <div className="grid-cards mb-8">
        <div className="glass glass-card">
          <h2 className="text-2xl mb-4">Nova Categoria</h2>
          <form action={createCategory} className="flex flex-col gap-4">
            <div className="input-group">
              <label className="input-label" htmlFor="name">Nome da Categoria</label>
              <input type="text" id="name" name="name" className="input-field" placeholder="Ex: Action Figures, Peças..." required />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="prefix">Prefixo do Código (Opcional)</label>
              <input type="text" id="prefix" name="prefix" className="input-field" placeholder="Ex: ACT (Será gerado automaticamente se vazio)" maxLength={5} />
            </div>
            <button type="submit" className="btn btn-primary mt-2" style={{ alignSelf: 'flex-start' }}>Salvar Categoria</button>
          </form>
        </div>

        <div className="glass glass-card" style={{ gridColumn: "span 2" }}>
          <h2 className="text-2xl mb-4">Lista de Categorias</h2>
          {categories.length === 0 ? (
            <p className="text-muted">Nenhuma categoria cadastrada.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Prefixo</th>
                    <th>Produtos Vinculados</th>
                    <th style={{ width: 80 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: 600 }}>{cat.name}</td>
                      <td><span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>{cat.prefix || '-'}</span></td>
                      <td>{cat._count.products}</td>
                      <td>
                        <DeleteButton id={cat.id} deleteAction={deleteCategory} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
