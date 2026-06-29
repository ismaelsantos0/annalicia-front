import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  X,
} from "lucide-react";
import { fetchProdutos, fetchClientes, fetchPedidosAdmin, loginAdmin, createProduto } from "../lib/api";
import { formatBRL } from "../lib/products";
import { formatWhatsApp } from "../lib/whatsapp";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Painel Admin — Annalicia Modas" }],
  }),
  component: AdminDashboard,
});

type Tab = "produtos" | "estoque" | "pedidos" | "marketing";

const navItems = [
  { id: "produtos" as Tab, label: "Produtos", icon: Shirt },
  { id: "estoque" as Tab, label: "Estoque", icon: Boxes },
  { id: "pedidos" as Tab, label: "Pedidos", icon: Receipt },
  { id: "marketing" as Tab, label: "Marketing", icon: Megaphone },
];

function AdminDashboard() {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_token");
    }
    return null;
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("produtos");

  const loginMutation = useMutation({
    mutationFn: () => loginAdmin(username, password),
    onSuccess: (data) => {
      localStorage.setItem("admin_token", data.access_token);
      setToken(data.access_token);
    },
    onError: (error) => alert(error.message || "Erro ao fazer login")
  });

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50 p-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); loginMutation.mutate(); }}
          className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl"
        >
          <div className="mb-8 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary text-white">
              <Sparkles className="h-6 w-6" />
            </span>
            <h1 className="mt-4 font-display text-2xl text-primary">Admin Loja</h1>
          </div>
          <div className="space-y-4">
            <input
              placeholder="Usuário"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full rounded-xl border border-pink-100 p-3 outline-none focus:border-primary"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-pink-100 p-3 outline-none focus:border-primary"
            />
            <button 
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:opacity-90"
            >
              {loginMutation.isPending ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
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
          <button 
            onClick={() => { localStorage.removeItem("admin_token"); setToken(null); }}
            className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-400 hover:text-red-500"
          >
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 px-4 py-8 sm:px-8">
        {tab === "pedidos" ? (
          <OrdersPanel token={token} />
        ) : tab === "marketing" ? (
          <MarketingPanel token={token} />
        ) : (
          <ProductsPanel token={token} />
        )}
      </main>
    </div>
  );
}

function ProductsPanel({ token }: { token: string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [imagem, setImagem] = useState("");

  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: fetchProdutos,
  });

  const mutation = useMutation({
    mutationFn: () => createProduto(token, {
      nome,
      preco: parseFloat(preco.replace(",", ".")),
      estoque: parseInt(estoque, 10),
      imagem_url: imagem || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      setModalOpen(false);
      setNome("");
      setPreco("");
      setEstoque("");
      setImagem("");
      alert("Produto salvo com sucesso!");
    },
    onError: (e) => alert(e.message)
  });

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Dashboard</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">Gestão de Peças</h1>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(236,72,153,0.55)] transition hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          Adicionar Nova Peça
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_40px_-25px_rgba(236,72,153,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50/50 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Foto</th>
                <th className="px-6 py-3 font-semibold">Nome</th>
                <th className="px-6 py-3 font-semibold">Preço</th>
                <th className="px-6 py-3 font-semibold">Estoque</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Carregando...</td></tr>
              ) : products.map((p: any) => (
                <tr key={p.id} className="border-t border-pink-50 hover:bg-pink-50/40">
                  <td className="px-6 py-4">
                    <img src={p.image} alt={p.name} className="h-14 w-12 rounded-xl object-cover" />
                  </td>
                  <td className="px-6 py-4 font-display text-base">{p.name}</td>
                  <td className="px-6 py-4 font-semibold text-primary">{formatBRL(p.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${p.stock < 10 ? "bg-pink-100 text-primary" : "bg-mint text-emerald-700"}`}>
                      {p.stock} un.
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl text-primary">Nova Peça ✨</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-full bg-pink-50 p-2 text-primary hover:bg-pink-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={e => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground/80">Nome da Peça</label>
                <input required value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Cropped Rosa" className="w-full rounded-xl border border-pink-100 p-3 outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground/80">Preço (R$)</label>
                  <input required type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} placeholder="0.00" className="w-full rounded-xl border border-pink-100 p-3 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground/80">Estoque</label>
                  <input required type="number" value={estoque} onChange={e => setEstoque(e.target.value)} placeholder="0" className="w-full rounded-xl border border-pink-100 p-3 outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground/80">Link da Imagem (Opcional)</label>
                <input value={imagem} onChange={e => setImagem(e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-pink-100 p-3 outline-none focus:border-primary" />
              </div>
              <button disabled={mutation.isPending} type="submit" className="mt-4 w-full rounded-full bg-primary py-3 font-semibold text-white shadow-lg transition hover:opacity-90">
                {mutation.isPending ? "Salvando..." : "Salvar Peça"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function OrdersPanel({ token }: { token: string }) {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["pedidos"],
    queryFn: () => fetchPedidosAdmin(token),
  });

  return (
    <>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Vendas</p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">Pedidos</h1>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_40px_-25px_rgba(236,72,153,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50/50 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Pedido ID</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">WhatsApp</th>
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Carregando...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Nenhum pedido ainda.</td></tr>
              ) : orders.map((o: any) => (
                <tr key={o.id} className="border-t border-pink-50 hover:bg-pink-50/40">
                  <td className="px-6 py-4 font-mono text-xs">{o.id}</td>
                  <td className="px-6 py-4 font-display">{o.cliente?.nome}</td>
                  <td className="px-6 py-4 text-muted-foreground">{o.cliente?.whatsapp}</td>
                  <td className="px-6 py-4 font-semibold text-primary">{formatBRL(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function MarketingPanel({ token }: { token: string }) {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => fetchClientes(token),
  });

  return (
    <>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Engajamento</p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">Marketing & Disparos</h1>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_40px_-25px_rgba(236,72,153,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50/50 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">WhatsApp</th>
                <th className="px-6 py-3">Endereço</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">Carregando...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">Nenhum cliente ainda.</td></tr>
              ) : customers.map((c: any) => (
                <tr key={c.id} className="border-t border-pink-50">
                  <td className="px-6 py-4 font-display">{c.nome}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.whatsapp}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{c.endereco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
