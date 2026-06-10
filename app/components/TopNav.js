"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Box, ShoppingCart, History, Settings, BarChart2, Menu, X } from "lucide-react";

export default function TopNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: <Home size={18} /> },
    { name: "PDV (Nova Venda)", href: "/vendas", icon: <ShoppingCart size={18} /> },
    { name: "Relatórios & Eventos", href: "/relatorios", icon: <BarChart2 size={18} /> },
    { name: "Produtos", href: "/produtos", icon: <Box size={18} /> },
    { name: "Categorias", href: "/categorias", icon: <Package size={18} /> },
    { name: "Histórico", href: "/historico", icon: <History size={18} /> },
    { name: "Ferramentas", href: "/ferramentas", icon: <Settings size={18} /> },
  ];

  return (
    <nav className="top-nav">
      <div className="top-nav-container">
        <Link href="/" className="logo-link">
          <Box size={24} color="var(--primary)" />
          <span>Hiperfoco 3D</span>
        </Link>

        {/* Desktop Links */}
        <div className="desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-link ${pathname === item.href ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
