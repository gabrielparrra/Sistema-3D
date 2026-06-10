"use client";

import { Trash2 } from "lucide-react";

export default function DeleteButton({ id, deleteAction }) {
  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    
    const res = await deleteAction(id);
    if (res?.error) {
      alert(res.error);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="text-danger" 
      title="Excluir" 
      style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '8px', transition: '0.2s', border: 'none', cursor: 'pointer' }}
    >
      <Trash2 size={18} />
    </button>
  );
}
