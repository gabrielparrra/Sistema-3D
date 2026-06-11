import { prisma } from "@/app/lib/prisma";
import { updateProduct, deleteProduct } from "@/app/actions/products";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import DeleteButton from "@/app/components/DeleteButton";
import { redirect } from "next/navigation";

export default async function ProductDetailPage({ params }) {
  // Fix Next.js 15+ async params
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    redirect("/produtos");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div className="fade-in">
      <header className="page-header">
        <div className="flex items-center gap-4">
          <Link href="/produtos" className="btn btn-secondary" style={{ padding: '8px' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="page-title">Editar Produto</h1>
        </div>
      </header>

      <div className="glass glass-card" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="flex flex-wrap gap-8">
          <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 300px" />
              ) : (
                <ImageIcon size={64} color="#94a3b8" />
              )}
            </div>
            {product.code && (
              <div style={{ textAlign: 'center' }}>
                <span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '1.25rem' }}>
                  {product.code}
                </span>
              </div>
            )}
          </div>

          <div style={{ flex: '2 1 400px' }}>
            <form action={updateProductWithId} className="flex flex-col gap-4">
              <div className="input-group">
                <label className="input-label" htmlFor="name">Nome do Produto</label>
                <input type="text" id="name" name="name" className="input-field" defaultValue={product.name} required />
              </div>

              <div className="flex gap-4 flex-wrap">
                <div className="input-group" style={{ flex: '1 1 200px' }}>
                  <label className="input-label" htmlFor="categoryId">Categoria</label>
                  <select id="categoryId" name="categoryId" className="input-field" defaultValue={product.categoryId} required>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="input-group" style={{ flex: '1 1 200px' }}>
                  <label className="input-label" htmlFor="stock">Estoque Disponível</label>
                  <input type="number" id="stock" name="stock" className="input-field" defaultValue={product.stock} min="0" required />
                </div>
              </div>

              <div className="flex gap-4 flex-wrap">
                <div className="input-group" style={{ flex: '1 1 200px' }}>
                  <label className="input-label" htmlFor="price">Preço de Venda (R$)</label>
                  <input type="number" step="0.01" id="price" name="price" className="input-field" defaultValue={product.price} required />
                </div>
                <div className="input-group" style={{ flex: '1 1 200px' }}>
                  <label className="input-label" htmlFor="cost">Custo de Impressão (R$)</label>
                  <input type="number" step="0.01" id="cost" name="cost" className="input-field" defaultValue={product.cost || ''} />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="image">Atualizar Imagem (Opcional)</label>
                <input type="file" id="image" name="image" accept="image/*" className="input-field" style={{ padding: '9px 16px' }} />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="description">Descrição</label>
                <textarea id="description" name="description" className="input-field" rows="3" defaultValue={product.description || ''}></textarea>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid var(--surface-border)' }}>
                <DeleteButton id={product.id} deleteAction={deleteProduct} />
                <button type="submit" className="btn btn-primary">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
