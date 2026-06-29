const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchProdutos() {
  const res = await fetch(`${API_URL}/produtos`);
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao buscar produtos");
  const data = await res.json();
  return data.map((p: any, index: number) => {
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
      preco_custo: p.preco_custo || 0,
      price: p.preco,
      category: p.categoria ? p.categoria.nome : "Geral",
      categoria_id: p.categoria_id,
      images: parsedImages,
      stock: p.estoque,
      isNew: index < 4,
    };
  });
}

export async function fetchDashboardStats(token: string) {
  const res = await fetch(`${API_URL}/pedidos/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao buscar estatÃ­sticas");
  return res.json();
}

export async function createProduto(token: string, dados: {
  nome: string;
  preco_custo: number;
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
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
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
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao deletar produto");
  return true;
}

export async function updateProduto(token: string, id: string, dados: {
  nome?: string;
  preco_custo?: number;
  preco?: number;
  estoque?: number;
  imagem_url?: string;
  categoria_id?: string | null;
  descricao?: string;
}) {
  const res = await fetch(`${API_URL}/produtos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(dados),
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Falha ao atualizar produto");
  }
  return res.json();
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
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao atualizar estoque");
  return res.json();
}

export async function fetchCategorias() {
  const res = await fetch(`${API_URL}/categorias`);
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
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
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao criar categoria");
  return res.json();
}

export async function deleteCategoria(token: string, id: string) {
  const res = await fetch(`${API_URL}/categorias/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao deletar categoria");
  return true;
}

export async function deleteConfiguracao(token: string, id: number) {
  const res = await fetch(`${API_URL}/configuracoes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao deletar configuraÃ§Ã£o");
  return true;
}

export async function fetchWhatsAppStatus(token: string) {
  const res = await fetch(`${API_URL}/whatsapp/status`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao buscar status do WhatsApp");
  return res.json();
}

export async function fetchWhatsAppQRCode(token: string) {
  const res = await fetch(`${API_URL}/whatsapp/qrcode`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
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
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
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
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
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
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao buscar clientes");
  return res.json();
}

export async function enviarDisparo(token: string, mensagem: string) {
  const res = await fetch(`${API_URL}/clientes/disparo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ mensagem })
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Falha ao iniciar disparo");
  }
  return res.json();
}

export async function fetchPedidosAdmin(token: string) {
  const res = await fetch(`${API_URL}/pedidos`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao buscar pedidos");
  return res.json();
}

export async function updateOrderStatus(token: string, id: string, status: string) {
  const res = await fetch(`${API_URL}/pedidos/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || "Falha ao atualizar status do pedido");
  }
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
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) {
    let msg = "Credenciais invÃ¡lidas";
    try {
      const err = await res.json();
      msg = err.detail || msg;
    } catch (e) {}
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchConfiguracoes(token?: string) {
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/configuracoes`, { headers });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao buscar configuraÃ§Ãµes");
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
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao atualizar configuraÃ§Ãµes");
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
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Falha ao importar do Instagram");
  }
  return res.json();
}

export async function fetchZonasEntrega() {
  const res = await fetch(`${API_URL}/zonas-entrega`);
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
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
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
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
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao atualizar zona de entrega");
  return res.json();
}

export async function deleteZonaEntrega(token: string, id: string) {
  const res = await fetch(`${API_URL}/zonas-entrega/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao deletar zona de entrega");
  return true;
}

export async function seedBoaVista(token: string) {
  const res = await fetch(`${API_URL}/zonas-entrega/seed-boa-vista`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao autocompletar bairros");
  return res.json();
}

export async function fetchBanners() {
  const res = await fetch(`${API_URL}/banners`);
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao buscar banners");
  return res.json();
}

export async function createBanner(token: string, dados: any) {
  const res = await fetch(`${API_URL}/banners`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(dados),
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao criar banner");
  return res.json();
}

export async function updateBanner(token: string, id: string, dados: any) {
  const res = await fetch(`${API_URL}/banners/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(dados),
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao atualizar banner");
  return res.json();
}

export async function deleteBanner(token: string, id: string) {
  const res = await fetch(`${API_URL}/banners/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao deletar banner");
  return true;
}

export async function toggleDestaqueProduto(token: string, id: string) {
  const res = await fetch(`${API_URL}/produtos/${id}/destaque`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({})
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) {
    let msg = "Falha ao alterar destaque";
    try {
      const err = await res.json();
      msg = err.detail || msg;
    } catch (e) {}
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchDestaques() {
  const res = await fetch(`${API_URL}/produtos/destaques`);
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error("Falha ao buscar destaques");
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
      images: parsedImages,
      stock: p.estoque,
      destaque: p.destaque,
    };
  });
}

export async function verifyToken(token: string) {
  const res = await fetch($(${API_URL})/auth/me, {
    headers: { Authorization: Bearer $(${token}) }
  });
  if (res.status === 401) window.dispatchEvent(new Event('unauthorized'));
  if (!res.ok) throw new Error('Token inválido');
  return res.json();
}
