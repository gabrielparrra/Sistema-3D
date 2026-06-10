"use client";

import { useState } from "react";
import { Plus, Trash2, ShoppingCart } from "lucide-react";
import { createSale } from "../actions/sales";
import { useRouter } from "next/navigation";

export default function POS({ products }) {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pix");
  const [amountGiven, setAmountGiven] = useState(0);

  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(term);
    const codeMatch = p.code?.toLowerCase().includes(term);
    return nameMatch || codeMatch;
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.productId === product.id);
      const currentQty = existing ? existing.quantity : 0;
      
      if (currentQty >= product.stock) {
        alert(`Você só tem ${product.stock} unidade(s) de ${product.name} em estoque.`);
        return prev;
      }

      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1, stock: product.stock }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => prev.map(item => {
      if (item.productId === productId) {
        const newQ = item.quantity + delta;
        if (newQ > item.stock) {
          alert(`Estoque máximo atingido: ${item.stock} unidade(s).`);
          return item;
        }
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const finalAmount = Math.max(0, totalAmount - discount);
  const changeAmount = amountGiven - finalAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (paymentMethod === "Dinheiro" && changeAmount < 0) {
      alert("Valor em dinheiro insuficiente para a compra.");
      return;
    }

    setLoading(true);
    const res = await createSale({ items: cart, discount, paymentMethod });
    setLoading(false);
    
    if (res?.error) {
      alert(res.error);
    } else {
      setCart([]);
      setDiscount(0);
      setAmountGiven(0);
      alert("Venda registrada com sucesso!");
      router.push("/historico");
    }
  };

  return (
    <div className="pos-layout mb-8">
      <div className="glass glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h2 className="text-2xl">Produtos Disponíveis</h2>
          <div className="input-group" style={{ marginBottom: 0, flex: '1 1 200px', maxWidth: '300px' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Buscar por nome ou código..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px' }}
            />
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <p className="text-muted">Nenhum produto encontrado com "{searchTerm}".</p>
        ) : (
          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {filteredProducts.map(p => (
            <div key={p.id} className="glass" style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
              {p.imageUrl ? (
                <div style={{ width: '100%', height: '140px', background: `url(${p.imageUrl}) center/cover` }}></div>
              ) : (
                <div style={{ width: '100%', height: '140px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="text-muted text-sm">Sem Imagem</span>
                </div>
              )}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted">{p.category.name}</div>
                  {p.code && (
                    <span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, fontSize: '0.75rem' }}>
                      {p.code}
                    </span>
                  )}
                </div>
                
                <div className={`text-sm ${p.stock > 0 ? 'text-primary' : 'text-danger'}`} style={{ fontWeight: 500 }}>
                  {p.stock > 0 ? `${p.stock} em estoque` : 'Esgotado'}
                </div>
                
                <div className="text-success" style={{ fontWeight: 600, fontSize: '1.25rem' }}>R$ {p.price.toFixed(2)}</div>
                
                <button 
                  onClick={() => addToCart(p)} 
                  className={`btn ${p.stock === 0 ? 'btn-danger' : 'btn-secondary'} mt-2`} 
                  style={{ padding: '8px', opacity: p.stock === 0 ? 0.5 : 1 }}
                  disabled={p.stock === 0}
                >
                  <Plus size={16} /> {p.stock === 0 ? 'Sem Estoque' : 'Adicionar'}
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      <div className="glass glass-card" style={{ display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
        <h2 className="text-2xl mb-4 flex items-center gap-2"><ShoppingCart /> Carrinho</h2>
        
        {cart.length === 0 ? (
          <p className="text-muted">Seu carrinho está vazio.</p>
        ) : (
          <div className="flex" style={{ flexDirection: 'column', gap: '12px', flex: 1 }}>
            {cart.map(item => (
              <div key={item.productId} className="flex justify-between items-center" style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div className="text-sm">R$ {item.price.toFixed(2)} x {item.quantity} = R$ {(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => updateQuantity(item.productId, -1)} className="btn btn-secondary" style={{ padding: '4px 8px' }}>-</button>
                  <button onClick={() => updateQuantity(item.productId, 1)} className="btn btn-secondary" style={{ padding: '4px 8px' }}>+</button>
                  <button onClick={() => removeFromCart(item.productId)} className="text-danger ml-2"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}

            <div className="mt-8" style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '16px' }}>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>R$ {totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="input-group mb-4">
                <label className="input-label" htmlFor="discount">Desconto (R$)</label>
                <input 
                  type="number" 
                  id="discount" 
                  className="input-field" 
                  value={discount} 
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="input-group mb-4">
                <label className="input-label" htmlFor="paymentMethod">Método de Pagamento</label>
                <select 
                  id="paymentMethod" 
                  className="input-field" 
                  value={paymentMethod} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Pix">Pix</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>

              {paymentMethod === "Dinheiro" && (
                <div className="input-group mb-4" style={{ background: 'rgba(20, 184, 166, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
                  <label className="input-label" htmlFor="amountGiven" style={{ color: '#0f766e' }}>Dinheiro dado pelo cliente (R$)</label>
                  <input 
                    type="number" 
                    id="amountGiven" 
                    className="input-field" 
                    value={amountGiven} 
                    onChange={(e) => setAmountGiven(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    style={{ borderColor: '#14b8a6' }}
                  />
                  <div className="flex justify-between mt-3 text-sm" style={{ fontWeight: 600 }}>
                    <span style={{ color: '#0f766e' }}>Troco a devolver:</span>
                    <span style={{ color: changeAmount >= 0 ? '#10b981' : '#ef4444', fontSize: '1.2rem' }}>
                      R$ {changeAmount > 0 ? changeAmount.toFixed(2) : '0.00'}
                    </span>
                  </div>
                  {changeAmount < 0 && amountGiven > 0 && (
                    <div className="text-danger text-sm mt-1">Falta R$ {Math.abs(changeAmount).toFixed(2)}</div>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-4" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                <span>Total</span>
                <span className="text-success">R$ {finalAmount.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleCheckout} 
                className="btn btn-primary mt-6" 
                style={{ width: '100%', padding: '16px' }}
                disabled={loading || (paymentMethod === "Dinheiro" && changeAmount < 0)}
              >
                {loading ? 'Processando...' : 'Finalizar Venda'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
