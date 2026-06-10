"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Image as ImageIcon, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function ProductTable({ initialProducts }) {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...initialProducts].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    // Handle nested fields or special cases
    if (sortField === 'category') {
      valA = a.category?.name || '';
      valB = b.category?.name || '';
    } else if (sortField === 'createdAt' || sortField === 'updatedAt') {
      valA = new Date(a[sortField]).getTime();
      valB = new Date(b[sortField]).getTime();
    } else if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = (valB || '').toLowerCase();
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-muted" style={{ opacity: 0.5 }} />;
    return sortDirection === 'asc' ? <ArrowUp size={14} className="text-primary" /> : <ArrowDown size={14} className="text-primary" />;
  };

  if (initialProducts.length === 0) {
    return <p className="text-muted">Nenhum produto cadastrado.</p>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th style={{ width: 60 }}>Img</th>
            <th onClick={() => handleSort('code')} style={{ cursor: 'pointer', userSelect: 'none' }}>
              <div className="flex items-center gap-1">Cód <SortIcon field="code" /></div>
            </th>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
              <div className="flex items-center gap-1">Nome <SortIcon field="name" /></div>
            </th>
            <th onClick={() => handleSort('category')} style={{ cursor: 'pointer', userSelect: 'none' }}>
              <div className="flex items-center gap-1">Categoria <SortIcon field="category" /></div>
            </th>
            <th onClick={() => handleSort('price')} style={{ cursor: 'pointer', userSelect: 'none' }}>
              <div className="flex items-center gap-1">Preço <SortIcon field="price" /></div>
            </th>
            <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer', userSelect: 'none' }} className="hidden sm:table-cell">
              <div className="flex items-center gap-1">Cadastro <SortIcon field="createdAt" /></div>
            </th>
            <th onClick={() => handleSort('updatedAt')} style={{ cursor: 'pointer', userSelect: 'none' }} className="hidden md:table-cell">
              <div className="flex items-center gap-1">Modificado <SortIcon field="updatedAt" /></div>
            </th>
            <th style={{ width: 80 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((p) => (
            <tr key={p.id}>
              <td>
                {p.imageUrl ? (
                  <div style={{ width: 40, height: 40, position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                    <Image src={p.imageUrl} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="40px" />
                  </div>
                ) : (
                  <div style={{ width: 40, height: 40, background: 'rgba(0,0,0,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ImageIcon size={20} color="#94a3b8" />
                  </div>
                )}
              </td>
              <td>
                <span style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '0.85rem' }}>
                  {p.code || '-'}
                </span>
              </td>
              <td>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                {p.description && <div className="text-sm text-muted">{p.description}</div>}
                <div className={`text-sm mt-1 ${p.stock > 0 ? 'text-success' : 'text-danger'}`} style={{ fontWeight: 600 }}>
                  {p.stock} em estoque
                </div>
              </td>
              <td>{p.category?.name}</td>
              <td className="text-success" style={{ fontWeight: 600 }}>R$ {p.price.toFixed(2)}</td>
              <td className="hidden sm:table-cell text-sm text-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
              <td className="hidden md:table-cell text-sm text-muted">{new Date(p.updatedAt).toLocaleDateString()}</td>
              <td>
                <Link href={`/produtos/${p.id}`} className="btn btn-secondary" style={{ padding: '8px', borderRadius: '8px', display: 'inline-flex' }} title="Detalhes / Editar">
                  <Edit size={18} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
