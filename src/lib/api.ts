const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchProdutos() {
  const res = await fetch(`${API_URL}/produtos`);
  if (!res.ok) throw new Error("Falha ao buscar produtos");
  const data = await res.json();
  return data.map((p: any) => ({
    id: p.id,
    name: p.nome,
    price: p.preco,
    category: "Geral",
    image: p.imagem_url,
    stock: p.estoque,
  }));
}

export async function createPedido(dados: {
  cliente_nome: string;
  cliente_whatsapp: string;
  cliente_endereco: string;
  itens: { produto_id: string; quantidade: number }[];
}) {
  const res = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Falha ao criar pedido");
  }
  return res.json();
}

export async function fetchClientes(token: string) {
  const res = await fetch(`${API_URL}/clientes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Falha ao buscar clientes");
  return res.json();
}

export async function fetchPedidosAdmin(token: string) {
  const res = await fetch(`${API_URL}/pedidos`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Falha ao buscar pedidos");
  return res.json();
}

export async function loginAdmin(username: string, password: string) {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);
  
  const res = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!res.ok) throw new Error("Credenciais inválidas");
  return res.json();
}
