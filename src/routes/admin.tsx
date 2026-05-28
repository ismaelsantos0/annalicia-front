import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  ShoppingCart,
  Settings,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { products, formatBRL } from "../lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Painel Admin — Boutique Eleganza" }],
  }),
  component: AdminDashboard,
});

const navItems = [
  { label: "Produtos", icon: Package, active: true },
  { label: "Pedidos", icon: ShoppingCart },
  { label: "Configurações", icon: Settings },
];

function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* Sidebar */}
      <aside className="border-b border-border bg-secondary/40 md:w-64 md:border-b-0 md:border-r">
        <div className="border-b border-border px-6 py-6">
          <p className="font-serif text-lg tracking-[0.2em] uppercase">
            Eleganza
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            Painel Administrativo
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-4 md:flex-col md:gap-1">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`flex items-center gap-3 whitespace-nowrap px-4 py-2.5 text-sm transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-background"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="hidden border-t border-border p-4 md:block">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar à loja
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-4 py-8 sm:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl">Produtos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie as peças da sua boutique.
            </p>
          </div>
          <button
            onClick={() => alert("Abrir modal: Adicionar nova peça")}
            className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-xs uppercase tracking-widest text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Adicionar Nova Peça
          </button>
        </div>

        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-normal">Foto</th>
                <th className="px-4 py-3 font-normal">Nome</th>
                <th className="px-4 py-3 font-normal">Categoria</th>
                <th className="px-4 py-3 font-normal">Preço</th>
                <th className="px-4 py-3 font-normal">Estoque</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-14 w-12 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-serif text-base">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.category}
                  </td>
                  <td className="px-4 py-3">{formatBRL(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs">
                      {p.stock} un.
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
