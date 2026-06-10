"use client";

import { useState } from "react";
import { clearSalesHistory, bulkAdjustPrices, bulkAdjustStock, bulkTransferCategory, bulkRegenerateCodes } from "@/app/actions/tools";
import { AlertTriangle, Percent, PackageOpen, Download, FolderGit2, Hash, HardDriveUpload, HardDriveDownload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ToolsDashboard({ categories }) {
  const router = useRouter();
  
  const [priceCat, setPriceCat] = useState("ALL");
  const [pricePercent, setPricePercent] = useState("");
  const [priceLoading, setPriceLoading] = useState(false);

  const [stockCat, setStockCat] = useState("ALL");
  const [stockValue, setStockValue] = useState("0");
  const [stockLoading, setStockLoading] = useState(false);

  const [fromCat, setFromCat] = useState("");
  const [toCat, setToCat] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);

  const [codeCat, setCodeCat] = useState("ALL");
  const [codeLoading, setCodeLoading] = useState(false);

  const [clearLoading, setClearLoading] = useState(false);

  const [backupLoading, setBackupLoading] = useState(false);

  const handleClearSales = async () => {
    const confirmText = prompt('Esta ação apagará TODAS AS VENDAS permanentemente. Digite "LIMPAR" para confirmar:');
    if (confirmText !== "LIMPAR") return;

    setClearLoading(true);
    const res = await clearSalesHistory();
    setClearLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      alert("Histórico de vendas limpo com sucesso!");
      router.refresh();
    }
  };

  const handleAdjustPrices = async (e) => {
    e.preventDefault();
    if (!pricePercent) return;
    
    if (!confirm(`Tem certeza que deseja aplicar um ajuste de ${pricePercent}% nos produtos?`)) return;

    setPriceLoading(true);
    const res = await bulkAdjustPrices(priceCat, pricePercent);
    setPriceLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      alert("Preços atualizados com sucesso!");
      setPricePercent("");
      router.refresh();
    }
  };

  const handleAdjustStock = async (e) => {
    e.preventDefault();
    if (!stockValue) return;

    if (!confirm(`Tem certeza que deseja redefinir o estoque para ${stockValue} unidades?`)) return;

    setStockLoading(true);
    const res = await bulkAdjustStock(stockCat, stockValue);
    setStockLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      alert("Estoque atualizado com sucesso!");
      router.refresh();
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!fromCat || !toCat) return;

    if (!confirm(`Confirma a transferência de todos os produtos para a nova categoria?`)) return;

    setTransferLoading(true);
    const res = await bulkTransferCategory(fromCat, toCat);
    setTransferLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      alert("Produtos transferidos com sucesso!");
      router.refresh();
    }
  };

  const handleRegenerateCodes = async (e) => {
    e.preventDefault();

    if (!confirm(`Aviso: Isso irá sobrescrever todos os códigos dos produtos selecionados gerando novos em massa. Confirma?`)) return;

    setCodeLoading(true);
    const res = await bulkRegenerateCodes(codeCat);
    setCodeLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      alert("Códigos gerados com sucesso!");
      router.refresh();
    }
  };

  const handleBackupUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm("AVISO: Isso irá apagar todos os dados atuais e restaurar o sistema exatamente como estava no backup. O servidor precisará ser reiniciado. Continuar?")) {
      e.target.value = "";
      return;
    }

    setBackupLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/backup/import", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (data.error) {
        alert(data.error);
      } else {
        alert("Backup restaurado! Feche a tela preta e abra o atalho do sistema novamente para recarregar o banco de dados.");
        window.location.href = "/";
      }
    } catch (err) {
      alert("Erro crítico ao tentar restaurar o backup.");
    } finally {
      setBackupLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      
      {/* Tool: Export Products */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #8b5cf6' }}>
        <div className="flex items-center gap-3" style={{ color: '#8b5cf6' }}>
          <Download size={28} />
          <h2 className="text-xl" style={{ fontWeight: 700 }}>Exportar Produtos</h2>
        </div>
        <p className="text-muted text-sm" style={{ flex: 1 }}>
          Baixa a base de dados completa do seu estoque em formato Excel (.xlsx). Inclui Nomes, Códigos, Quantidades e Preços.
        </p>
        <a 
          href="/api/export/products"
          target="_blank"
          className="btn" 
          style={{ width: '100%', background: '#8b5cf6', color: 'white' }}
        >
          Baixar Planilha (.xlsx)
        </a>
      </div>

      {/* Tool: Backup Export */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #0ea5e9' }}>
        <div className="flex items-center gap-3" style={{ color: '#0ea5e9' }}>
          <HardDriveDownload size={28} />
          <h2 className="text-xl" style={{ fontWeight: 700 }}>Salvar Backup</h2>
        </div>
        <p className="text-muted text-sm" style={{ flex: 1 }}>
          Gera um arquivo .zip com todo o seu banco de dados e fotos cadastradas. Salve isso num pendrive ou na nuvem semanalmente para nunca perder nada.
        </p>
        <a 
          href="/api/backup/export"
          target="_blank"
          className="btn" 
          style={{ width: '100%', background: '#0ea5e9', color: 'white' }}
        >
          Baixar Backup (.zip)
        </a>
      </div>

      {/* Tool: Backup Import */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #f43f5e' }}>
        <div className="flex items-center gap-3" style={{ color: '#f43f5e' }}>
          <HardDriveUpload size={28} />
          <h2 className="text-xl" style={{ fontWeight: 700 }}>Restaurar Backup</h2>
        </div>
        <p className="text-muted text-sm" style={{ flex: 1 }}>
          Restaurar o sistema a partir de um backup anterior. <b style={{ color: '#ef4444' }}>ATENÇÃO:</b> Isso irá apagar os dados atuais e voltar para os dados do arquivo enviado.
        </p>
        
        <label className={`btn ${backupLoading ? 'btn-secondary' : ''}`} style={{ width: '100%', background: backupLoading ? '' : '#f43f5e', color: backupLoading ? '' : 'white', cursor: 'pointer', textAlign: 'center' }}>
          {backupLoading ? 'Restaurando, aguarde...' : 'Enviar Arquivo (.zip)'}
          <input 
            type="file" 
            accept=".zip" 
            style={{ display: 'none' }} 
            onChange={handleBackupUpload} 
            disabled={backupLoading} 
          />
        </label>
      </div>

      {/* Tool: Regenerate Codes */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #f59e0b' }}>
        <div className="flex items-center gap-3 text-warning">
          <Hash size={28} />
          <h2 className="text-xl" style={{ fontWeight: 700 }}>Gerar Códigos SKU</h2>
        </div>
        <p className="text-muted text-sm">
          Auto-gera códigos sequenciais baseados no nome da categoria (Ex: CLK-001) para organizar seu estoque rapidamente.
        </p>
        <form onSubmit={handleRegenerateCodes} className="flex flex-col gap-4" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <div className="input-group">
            <select className="input-field" value={codeCat} onChange={e => setCodeCat(e.target.value)}>
              <option value="ALL">Todas as Categorias</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn" disabled={codeLoading} style={{ background: '#f59e0b', color: '#fff' }}>
            {codeLoading ? 'Gerando...' : 'Gerar Códigos em Massa'}
          </button>
        </form>
      </div>

      {/* Tool: Transfer Category */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #14b8a6' }}>
        <div className="flex items-center gap-3" style={{ color: '#14b8a6' }}>
          <FolderGit2 size={28} />
          <h2 className="text-xl" style={{ fontWeight: 700 }}>Mover Produtos</h2>
        </div>
        <p className="text-muted text-sm">
          Transfere todos os produtos de uma categoria para outra. Útil para fundir categorias obsoletas.
        </p>
        <form onSubmit={handleTransfer} className="flex flex-col gap-4" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <select className="input-field" value={fromCat} onChange={e => setFromCat(e.target.value)} required>
              <option value="">De: (Categoria Original)</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <select className="input-field" value={toCat} onChange={e => setToCat(e.target.value)} required>
              <option value="">Para: (Nova Categoria)</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn" disabled={transferLoading} style={{ background: '#14b8a6', color: '#fff' }}>
            {transferLoading ? 'Transferindo...' : 'Transferir Tudo'}
          </button>
        </form>
      </div>

      {/* Tool: Bulk Price Adjust */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #2563eb' }}>
        <div className="flex items-center gap-3 text-primary">
          <Percent size={28} />
          <h2 className="text-xl" style={{ fontWeight: 700 }}>Reajuste de Preços</h2>
        </div>
        <p className="text-muted text-sm">
          Aplica um aumento ou desconto em porcentagem (ex: 15 ou -10) em todos os produtos de uma categoria.
        </p>
        <form onSubmit={handleAdjustPrices} className="flex flex-col gap-4" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <div className="input-group">
            <select className="input-field" value={priceCat} onChange={e => setPriceCat(e.target.value)}>
              <option value="ALL">Todas as Categorias</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <input type="number" step="0.1" className="input-field" placeholder="Porcentagem (Ex: 10 para +10%)" value={pricePercent} onChange={e => setPricePercent(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={priceLoading}>
            {priceLoading ? 'Processando...' : 'Aplicar Reajuste'}
          </button>
        </form>
      </div>

      {/* Tool: Bulk Stock Adjust */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #10b981' }}>
        <div className="flex items-center gap-3 text-success">
          <PackageOpen size={28} />
          <h2 className="text-xl" style={{ fontWeight: 700 }}>Redefinir Estoque</h2>
        </div>
        <p className="text-muted text-sm">
          Define a quantidade de estoque de todos os produtos selecionados para um valor específico (como 0).
        </p>
        <form onSubmit={handleAdjustStock} className="flex flex-col gap-4" style={{ flex: 1, justifyContent: 'flex-end' }}>
          <div className="input-group">
            <select className="input-field" value={stockCat} onChange={e => setStockCat(e.target.value)}>
              <option value="ALL">Todas as Categorias</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <input type="number" min="0" className="input-field" placeholder="Novo valor de estoque (Ex: 0)" value={stockValue} onChange={e => setStockValue(e.target.value)} required />
          </div>
          <button type="submit" className="btn" disabled={stockLoading} style={{ background: '#10b981', color: '#fff' }}>
            {stockLoading ? 'Processando...' : 'Redefinir Estoque'}
          </button>
        </form>
      </div>

      {/* Tool: Clear Sales */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '4px solid #ef4444' }}>
        <div className="flex items-center gap-3 text-danger">
          <AlertTriangle size={28} />
          <h2 className="text-xl" style={{ fontWeight: 700 }}>Reset de Histórico</h2>
        </div>
        <p className="text-muted text-sm" style={{ flex: 1 }}>
          Apaga todo o histórico de vendas permanentemente e zera o Dashboard. Use isso para limpar dados de teste ou virar o mês.
        </p>
        <button 
          onClick={handleClearSales}
          className="btn btn-danger" 
          disabled={clearLoading}
          style={{ marginTop: 'auto' }}
        >
          {clearLoading ? 'Limpando...' : 'Limpar Todas as Vendas'}
        </button>
      </div>

    </div>
  );
}
