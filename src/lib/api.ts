const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchProdutos() {
  const res = await fetch(`${API_URL}/produtos`);
  if (!res.ok) throw new Error("Falha ao buscar produtos");
  const data = await res.json();
  return data.map((p: any) => {
    let parsedImages = [];
    try {
      const parsed = JSON.parse(p.imagem_url);
      parsedImages = Array.isArray(parsed) ? parsed : [p.imagem_url];
    } catch {
      parsedImages = p.imagem_url ? [p.imagem_url] : [];
    }
    return {
      id: p.id,
      name: p.nome,
      price: p.preco,
      category: p.categoria ? p.categoria.nome : "Geral",
      categoria_id: p.categoria_id,
      images: parsedImages,
      stock: p.estoque,
    };
  });
}

export async function createProduto(token: string, dados: {
  nome: string;
  preco: number;
  estoque: number;
  imagem_url: string;
  categoria_id?: string;
}) {
  const res = await fetch(`${API_URL}/produtos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(dados),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Falha ao criar produto");
  }
  return res.json();
}

export async function deleteProduto(token: string, id: string) {
  const res = await fetch(`${API_URL}/produtos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Falha ao deletar produto");
  return true;
}

export async function updateEstoqueProduto(token: string, id: string, estoque: number) {
  const res = await fetch(`${API_URL}/produtos/${id}/estoque`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ estoque }),
  });
  if (!res.ok) throw new Error("Falha ao atualizar estoque");
  return res.json();
}

export async function fetchCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  if (!res.ok) throw new Error("Falha ao buscar categorias");
  return res.json();
}

export async function createCategoria(token: string, nome: string) {
  const res = await fetch(`${API_URL}/categorias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ nome }),
  });
  if (!res.ok) throw new Error("Falha ao criar categoria");
  return res.json();
}

export async function deleteCategoria(token: string, id: string) {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Falha ao deletar categoria");
  return true;
}

export async function deleteConfiguracao(token: string, id: number) {
  const res = await fetch(`${API_URL}/configuracoes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Falha ao deletar configuração");
  return true;
}

export async function fetchWhatsAppStatus(token: string) {
  const res = await fetch(`${API_URL}/whatsapp/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Falha ao buscar status do WhatsApp");
  return res.json();
}

export async function fetchWhatsAppQRCode(token: string) {
  const res = await fetch(`${API_URL}/whatsapp/qrcode`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Falha ao buscar QR Code");
  }
  return res.json();
}

export async function logoutWhatsApp(token: string) {
  const res = await fetch(`${API_URL}/whatsapp/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Falha ao desconectar WhatsApp");
  return true;
}

export async function createPedido(dados: {
  cliente_nome: string;
  cliente_whatsapp: string;
  cliente_endereco: string;
  tipo_entrega?: string;
  bairro_entrega?: string;
  taxa_entrega?: number;
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
  params.append("username", username.trim().toLowerCase());
  params.append("password", password.trim());
  
  const res = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!res.ok) {
    let msg = "Credenciais inválidas";
    try {
      const err = await res.json();
      msg = err.detail || msg;
    } catch (e) {}
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchConfiguracoes(token: string) {
  const res = await fetch(`${API_URL}/configuracoes`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Falha ao buscar configurações");
  return res.json();
}

export async function updateConfiguracoes(token: string, dados: Record<string, any>) {
  const res = await fetch(`${API_URL}/configuracoes`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Falha ao atualizar configurações");
  return res.json();
}

export async function importFromInstagram(token: string, url: string): Promise<{
  images: string[];
  caption: string;
  nome_sugerido: string;
}> {
  const res = await fetch(`${API_URL}/produtos/import-instagram`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Falha ao importar do Instagram");
  }
  return res.json();
}

export async function fetchZonasEntrega() {
  const res = await fetch(`${API_URL}/zonas-entrega`);
  if (!res.ok) throw new Error("Falha ao buscar zonas de entrega");
  return res.json();
}

export async function createZonaEntrega(token: string, dados: { bairro: string; taxa: number; ativo: boolean }) {
  const res = await fetch(`${API_URL}/zonas-entrega`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(dados),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Falha ao criar zona de entrega");
  }
  return res.json();
}

export async function updateZonaEntrega(token: string, id: string, dados: { taxa?: number; ativo?: boolean }) {
  const res = await fetch(`${API_URL}/zonas-entrega/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error("Falha ao atualizar zona de entrega");
  return res.json();
}

export async function deleteZonaEntrega(token: string, id: string) {
  const res = await fetch(`${API_URL}/zonas-entrega/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Falha ao deletar zona de entrega");
  return true;
}
