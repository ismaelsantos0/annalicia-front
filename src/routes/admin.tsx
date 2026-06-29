import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Trash2,
} from "lucide-react";
import Cropper from "react-easy-crop";
import { fetchProdutos, fetchClientes, fetchPedidosAdmin, loginAdmin, createProduto, deleteProduto, fetchCategorias, createCategoria, deleteCategoria } from "../lib/api";
import { formatBRL } from "../lib/products";
import { formatWhatsApp } from "../lib/whatsapp";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Painel Admin — Annalicia Modas" }],
  }),
  component: AdminDashboard,
});

type Tab = "produtos" | "categorias" | "estoque" | "pedidos" | "marketing";

const navItems = [
  { id: "produtos" as Tab, label: "Produtos", icon: Shirt },
  { id: "categorias" as Tab, label: "Categorias", icon: Boxes },
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
        ) : tab === "categorias" ? (
          <CategoriasPanel token={token} />
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
  const [categoriaId, setCategoriaId] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  
  // Imagens
  const [imagens, setImagens] = useState<string[]>([]);
  const [cropOpen, setCropOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: fetchProdutos,
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategorias,
  });

  const mutation = useMutation({
    mutationFn: () => createProduto(token, {
      nome,
      preco: parseFloat(preco.replace(",", ".")),
      estoque: parseInt(estoque, 10),
      categoria_id: (categoriaId && categoriaId !== "new") ? categoriaId : undefined,
      imagem_url: imagens.length > 0 ? JSON.stringify(imagens) : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      setModalOpen(false);
      setNome("");
      setPreco("");
      setEstoque("");
      setImagens([]);
      alert("Produto salvo com sucesso!");
    },
    onError: (e) => alert(e.message)
  });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    
    const MAX_SIZE = 1200;
    let width = pixelCrop.width;
    let height = pixelCrop.height;
    
    if (width > height) {
      if (width > MAX_SIZE) {
        height *= MAX_SIZE / width;
        width = MAX_SIZE;
      }
    } else {
      if (height > MAX_SIZE) {
        width *= MAX_SIZE / height;
        height = MAX_SIZE;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      width,
      height
    );
    
    return canvas.toDataURL("image/webp", 0.85);
  };

  const parseImage = (imgData: string) => {
    try {
      const parsed = JSON.parse(imgData);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imgData;
    } catch {
      return imgData;
    }
  };

  const deleteProdMutation = useMutation({
    mutationFn: (id: string) => deleteProduto(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      alert("Produto deletado com sucesso!");
    },
    onError: (e) => alert(e.message)
  });

  const createCatMutation = useMutation({
    mutationFn: (nome: string) => createCategoria(token, nome),
    onSuccess: (novaCat) => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setCategoriaId(novaCat.id);
      setNovaCategoria("");
      alert("Categoria criada com sucesso!");
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
                <th className="px-6 py-3 font-semibold">Categoria</th>
                <th className="px-6 py-3 font-semibold">Estoque</th>
                <th className="px-6 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Carregando...</td></tr>
              ) : products.map((p: any) => (
                <tr key={p.id} className="border-t border-pink-50 hover:bg-pink-50/40">
                  <td className="px-6 py-4">
                    <img src={parseImage(p.image)} alt={p.name} className="h-14 w-12 rounded-xl object-cover" />
                  </td>
                  <td className="px-6 py-4 font-display text-base">{p.name}</td>
                  <td className="px-6 py-4 font-semibold text-primary">{formatBRL(p.price)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-pink-100/50 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${p.stock < 10 ? "bg-pink-100 text-primary" : "bg-mint text-emerald-700"}`}>
                      {p.stock} un.
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Deletar o produto ${p.name}?`)) {
                          deleteProdMutation.mutate(p.id);
                        }
                      }}
                      className="text-muted-foreground hover:text-red-500 transition"
                      title="Deletar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
                <label className="mb-1 block text-sm font-medium text-foreground/80">Categoria</label>
                <div className="flex gap-2">
                  <select 
                    value={categoriaId} 
                    onChange={e => setCategoriaId(e.target.value)} 
                    className="flex-1 rounded-xl border border-pink-100 p-3 outline-none focus:border-primary bg-transparent"
                  >
                    <option value="">Geral</option>
                    {categorias.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                    <option value="new">+ Criar Nova Categoria</option>
                  </select>
                </div>
              </div>
              {categoriaId === "new" && (
                <div className="flex gap-2 items-end bg-pink-50 p-3 rounded-xl border border-pink-100">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-foreground/80">Nome da Nova Categoria</label>
                    <input 
                      value={novaCategoria} 
                      onChange={e => setNovaCategoria(e.target.value)} 
                      placeholder="Ex: Biquínis" 
                      className="w-full rounded-xl border border-pink-200 p-2 text-sm outline-none focus:border-primary" 
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      if (novaCategoria.trim()) {
                        createCatMutation.mutate(novaCategoria.trim());
                      }
                    }}
                    disabled={createCatMutation.isPending || !novaCategoria.trim()}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
                  >
                    {createCatMutation.isPending ? "..." : "Criar"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCategoriaId("")}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-muted-foreground shadow-sm transition hover:text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground/80">Imagens da Peça ({imagens.length})</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (event) => {
                      setImageToCrop(event.target?.result as string);
                      setCropOpen(true);
                      e.target.value = ""; // limpa o input para poder enviar a mesma imagem dnv
                    };
                  }}
                  className="w-full rounded-xl border border-pink-100 p-2 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-pink-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-pink-100" 
                />
                
                {imagens.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {imagens.map((img, idx) => (
                      <div key={idx} className="relative h-24 w-20 flex-shrink-0">
                        <img src={img} className="h-full w-full rounded-xl object-cover shadow-sm" />
                        <button 
                          type="button"
                          onClick={() => setImagens(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button disabled={mutation.isPending} type="submit" className="mt-4 w-full rounded-full bg-primary py-3 font-semibold text-white shadow-lg transition hover:opacity-90">
                {mutation.isPending ? "Salvando..." : "Salvar Peça"}
              </button>
            </form>
          </div>
        </div>
      )}

      {cropOpen && imageToCrop && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="flex h-full w-full max-w-lg flex-col rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-primary">Recortar Foto</h2>
              <button onClick={() => setCropOpen(false)} className="rounded-full bg-pink-50 p-2 text-primary hover:bg-pink-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="relative flex-1 rounded-xl bg-black/5 overflow-hidden">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={4 / 5} // Proporção padrão para moda
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
              />
            </div>
            
            <button 
              type="button"
              onClick={async () => {
                const cropped = await getCroppedImg(imageToCrop, croppedAreaPixels);
                setImagens(prev => [...prev, cropped]);
                setCropOpen(false);
                setImageToCrop(null);
              }}
              className="mt-6 w-full rounded-full bg-primary py-3.5 font-semibold text-white transition hover:opacity-90"
            >
              Confirmar Recorte
            </button>
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

function CategoriasPanel({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const [nome, setNome] = useState("");
  
  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategorias,
  });

  const createMutation = useMutation({
    mutationFn: (nome: string) => createCategoria(token, nome),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      setNome("");
      alert("Categoria criada com sucesso!");
    },
    onError: (e) => alert(e.message)
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategoria(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      alert("Categoria deletada com sucesso!");
    },
    onError: (e) => alert(e.message)
  });

  return (
    <>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Organização</p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">Categorias</h1>
      </div>

      <div className="mb-8 flex gap-4">
        <input 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          placeholder="Nome da Categoria (Ex: Biquínis)" 
          className="w-full max-w-sm rounded-full border border-pink-100 px-6 py-3 outline-none focus:border-primary" 
        />
        <button 
          onClick={() => {
            if (nome.trim()) {
              createMutation.mutate(nome.trim());
            }
          }}
          disabled={createMutation.isPending || !nome.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(236,72,153,0.55)] transition hover:scale-105 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {createMutation.isPending ? "Criando..." : "Criar"}
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_40px_-25px_rgba(236,72,153,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50/50 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-semibold">Nome</th>
                <th className="px-6 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={2} className="p-6 text-center text-muted-foreground">Carregando...</td></tr>
              ) : categorias.length === 0 ? (
                <tr><td colSpan={2} className="p-6 text-center text-muted-foreground">Nenhuma categoria cadastrada.</td></tr>
              ) : categorias.map((c: any) => (
                <tr key={c.id} className="border-t border-pink-50 hover:bg-pink-50/40">
                  <td className="px-6 py-4 font-display text-base">{c.nome}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Deletar a categoria ${c.nome}?`)) {
                          deleteMutation.mutate(c.id);
                        }
                      }}
                      className="text-muted-foreground hover:text-red-500 transition"
                      title="Deletar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
