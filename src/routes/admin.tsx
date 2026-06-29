import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shirt,
  Boxes,
  Receipt,
  Plus,
  ArrowLeft,
  Sparkles,
  Search,
  Megaphone,
  Send,
  Users,
} from "lucide-react";
import { products, formatBRL } from "../lib/products";
import { useCustomers } from "../lib/customers-context";
import { MarketingModal } from "../components/MarketingModal";
import { formatWhatsApp } from "../lib/whatsapp";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Painel Admin — Annalicia Modas" }],
  }),
  component: AdminDashboard,
});

type Tab = "produtos" | "estoque" | "pedidos" | "marketing";

const navItems: { id: Tab; label: string; icon: typeof Shirt }[] = [
  { id: "produtos", label: "Produtos", icon: Shirt },
  { id: "estoque", label: "Estoque", icon: Boxes },
  { id: "pedidos", label: "Pedidos", icon: Receipt },
  { id: "marketing", label: "Marketing", icon: Megaphone },
];

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("produtos");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="border-b border-pink-100 bg-white md:w-64 md:border-b-0 md:border-r">
        <div className="border-b border-pink-100 px-6 py-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-display text-lg text-primary">Annalicia</span>
          </Link>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Painel Admin
          </p>
        </div>
        <nav className="flex gap-2 overflow-x-auto p-4 md:flex-col">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-3 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-10px_rgba(236,72,153,0.55)]"
                    : "text-foreground/70 hover:bg-pink-50 hover:text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </nav>
        <div className="hidden border-t border-pink-100 p-4 md:block">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar à loja
          </Link>
        </div>
      </aside>

      <main className="flex-1 px-4 py-8 sm:px-8">
        {tab === "marketing" ? (
          <MarketingPanel />
        ) : tab === "pedidos" ? (
          <OrdersPanel />
        ) : (
          <ProductsPanel />
        )}
      </main>
    </div>
  );
}

function ProductsPanel() {
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Dashboard
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">
            Gestão de Peças
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie todo o seu catálogo aesthetic em um só lugar 💖
          </p>
        </div>
        <button
          onClick={() => alert("Abrir modal: Adicionar Nova Peça ✨")}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(236,72,153,0.55)] transition hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Adicionar Nova Peça
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Peças", value: products.length, tone: "bg-pink-100 text-primary" },
          { label: "Em estoque", value: products.reduce((s, p) => s + p.stock, 0), tone: "bg-mint text-emerald-700" },
          { label: "Pedidos hoje", value: 23, tone: "bg-pink-100 text-primary" },
          { label: "Receita", value: "R$ 4.2k", tone: "bg-mint text-emerald-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`mt-2 inline-block rounded-full px-3 py-1 font-display text-lg ${s.tone}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_40px_-25px_rgba(236,72,153,0.3)]">
        <div className="flex items-center justify-between gap-4 border-b border-pink-100 px-6 py-4">
          <h2 className="font-display text-lg">Todas as peças</h2>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar peça..."
              className="rounded-full border border-pink-100 bg-pink-50/50 py-2 pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50/50 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Foto</th>
                <th className="px-6 py-3 font-semibold">Nome da Peça</th>
                <th className="px-6 py-3 font-semibold">Categoria</th>
                <th className="px-6 py-3 font-semibold">Preço</th>
                <th className="px-6 py-3 font-semibold">Qtd. Estoque</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-pink-50 transition hover:bg-pink-50/40">
                  <td className="px-6 py-4">
                    <img src={p.image} alt={p.name} className="h-14 w-12 rounded-xl object-cover" />
                  </td>
                  <td className="px-6 py-4 font-display text-base">{p.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
                  <td className="px-6 py-4 font-semibold text-primary">{formatBRL(p.price)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        p.stock < 10
                          ? "bg-pink-100 text-primary"
                          : "bg-mint text-emerald-700"
                      }`}
                    >
                      {p.stock} un.
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function OrdersPanel() {
  const { orders, customers } = useCustomers();
  return (
    <>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Vendas
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">Pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tudo o que rolou nas vendas online ✨
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_40px_-25px_rgba(236,72,153,0.3)]">
        {orders.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            Nenhum pedido ainda. Faça uma compra na vitrine para testar.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-pink-50/50 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Pedido</th>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">WhatsApp</th>
                  <th className="px-6 py-3">Itens</th>
                  <th className="px-6 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const c = customers.find((x) => x.id === o.customerId);
                  return (
                    <tr
                      key={o.id}
                      className="border-t border-pink-50 hover:bg-pink-50/40"
                    >
                      <td className="px-6 py-4 font-mono text-xs">{o.id}</td>
                      <td className="px-6 py-4 font-display">{c?.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {c ? formatWhatsApp(c.whatsapp) : "—"}
                      </td>
                      <td className="px-6 py-4">{o.items.length}</td>
                      <td className="px-6 py-4 font-semibold text-primary">
                        {formatBRL(o.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function MarketingPanel() {
  const { customers, orders } = useCustomers();
  const [modal, setModal] = useState(false);

  const buyersCount = new Set(orders.map((o) => o.customerId)).size;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Engajamento
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">
            Marketing & Disparos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Reengaje suas clientes via WhatsApp com novidades e promoções 💌
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(236,72,153,0.55)] hover:scale-105"
        >
          <Send className="h-4 w-4" />
          Nova campanha
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Clientes" value={customers.length} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Compradoras" value={buyersCount} icon={<Sparkles className="h-4 w-4" />} />
        <StatCard label="Pedidos" value={orders.length} icon={<Receipt className="h-4 w-4" />} />
        <StatCard label="Campanhas" value={0} icon={<Megaphone className="h-4 w-4" />} />
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_40px_-25px_rgba(236,72,153,0.3)]">
        <div className="border-b border-pink-100 px-6 py-4">
          <h2 className="font-display text-lg">Base de clientes</h2>
          <p className="text-xs text-muted-foreground">
            Apenas clientes com WhatsApp confirmado recebem disparos.
          </p>
        </div>
        {customers.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            Sua base está vazia. Quando alguém finalizar um pedido, aparece aqui.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-pink-50/50 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">WhatsApp</th>
                  <th className="px-6 py-3">Endereço</th>
                  <th className="px-6 py-3">Pedidos</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t border-pink-50">
                    <td className="px-6 py-4 font-display">{c.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatWhatsApp(c.whatsapp)}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {c.address}
                    </td>
                    <td className="px-6 py-4">
                      {orders.filter((o) => o.customerId === c.id).length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MarketingModal open={modal} onClose={() => setModal(false)} />
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 font-display text-2xl text-primary">{value}</p>
    </div>
  );
}
