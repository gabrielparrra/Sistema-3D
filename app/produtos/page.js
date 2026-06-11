import { prisma } from "@/app/lib/prisma";
import { createProduct, deleteProduct } from "../actions/products";
import ProductFormCard from "./ProductFormCard";
import ProductTable from "./ProductTable";

export default async function ProdutosPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    include: { category: true }
  });

  return (
    <div className="fade-in">
      <header className="page-header">
        <h1 className="page-title">Produtos</h1>
      </header>

      <div className="flex" style={{ flexDirection: 'column', gap: '24px' }}>
      <ProductFormCard categories={categories} createProductAction={createProduct} />

        <div className="glass glass-card">
          <h2 className="text-2xl mb-4">Lista de Produtos</h2>
          <ProductTable initialProducts={products} />
        </div>
      </div>
    </div>
  );
}
