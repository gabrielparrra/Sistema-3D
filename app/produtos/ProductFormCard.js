"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function ProductFormCard({ categories, createProductAction }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="mb-8">
        <button onClick={() => setIsOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Novo Produto
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl">Cadastrar Novo Produto</h2>
        <button onClick={() => setIsOpen(false)} className="btn btn-secondary" style={{ padding: '8px' }}>
          <X size={18} /> Fechar
        </button>
      </div>
      
      {categories.length === 0 ? (
        <p className="text-danger">Você precisa cadastrar uma categoria primeiro.</p>
      ) : (
        <form action={createProductAction} className="flex flex-col gap-4" style={{ maxWidth: '800px' }}>
          <div className="flex gap-4 flex-wrap">
            <div className="input-group" style={{ flex: '1 1 300px' }}>
              <label className="input-label" htmlFor="name">Nome do Produto</label>
              <input type="text" id="name" name="name" className="input-field" required />
            </div>
            
            <div className="input-group" style={{ flex: '1 1 300px' }}>
              <label className="input-label" htmlFor="categoryId">Categoria</label>
              <select id="categoryId" name="categoryId" className="input-field" required>
                <option value="">Selecione...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="input-group" style={{ flex: '1 1 200px' }}>
              <label className="input-label" htmlFor="price">Preço de Venda (R$)</label>
              <input type="number" step="0.01" id="price" name="price" className="input-field" required />
            </div>
            <div className="input-group" style={{ flex: '1 1 200px' }}>
              <label className="input-label" htmlFor="cost">Custo de Impressão (R$)</label>
              <input type="number" step="0.01" id="cost" name="cost" className="input-field" />
            </div>
            <div className="input-group" style={{ flex: '1 1 250px' }}>
              <label className="input-label" htmlFor="image">Imagem do Produto</label>
              <input type="file" id="image" name="image" accept="image/*" className="input-field" style={{ padding: '9px 16px' }} />
            </div>
          </div>

          <div className="flex gap-4 flex-wrap mt-2">
            <div className="input-group" style={{ flex: '1 1 200px' }}>
              <label className="input-label" htmlFor="stock">Quantidade Inicial (Estoque)</label>
              <input type="number" id="stock" name="stock" className="input-field" defaultValue="0" min="0" required />
            </div>
          </div>

          <div className="input-group mt-2">
            <label className="input-label" htmlFor="description">Descrição (Opcional)</label>
            <textarea id="description" name="description" className="input-field" rows="2"></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary mt-2" style={{ alignSelf: 'flex-start' }} onClick={() => setTimeout(() => setIsOpen(false), 500)}>
            Salvar Produto
          </button>
        </form>
      )}
    </div>
  );
}
