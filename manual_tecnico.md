# Manual Completo da API (Integração Mobile / Frontend) — Annalicia Modas

Este manual foi desenhado especificamente para um **Agente de IA** ou **Desenvolvedor Mobile** que irá construir um aplicativo (iOS/Android) utilizando a mesma API Rest do backend atual.

O backend foi escrito em **FastAPI (Python)** e cuida automaticamente de toda a lógica pesada (WhatsApp, deduplicação, cálculo financeiro). O aplicativo mobile deve funcionar como um espelho de interface (Client-Side), apenas consumindo essas rotas.

---

## 1. Regras Gerais de Comunicação

### Autenticação
* **Tipo**: JWT (JSON Web Token) Bearer.
* As rotas públicas não exigem token.
* As rotas de administração exigem o envio do header:
  `Authorization: Bearer <seu_token_jwt>`

### Formato de Dados
* Todas as requisições que enviam dados devem usar `Content-Type: application/json`, com exceção do login que usa `application/x-www-form-urlencoded`.
* As respostas são padronizadas em JSON.

---

## 2. Autenticação

### `POST /auth/login`
- **Público**: Sim
- **Objetivo**: Autenticar o lojista para o painel de admin.
- **Formato (Body)**: `application/x-www-form-urlencoded`
- **Campos esperados**:
  - `username` (string)
  - `password` (string)
- **Resposta Sucesso (200)**:
  ```json
  {
    "access_token": "eyJhb...",
    "token_type": "bearer"
  }
  ```

---

## 3. Endpoints Públicos (Para o App do Cliente)

Estes endpoints não requerem token JWT e devem ser usados para construir a vitrine, o fluxo de compras e a tela inicial do App Mobile.

### `GET /banners`
- **Objetivo**: Carregar os destaques da tela inicial (carrossel).
- **Resposta**: Retorna uma lista de objetos:
  ```json
  [
    {
      "id": 1,
      "badge_text": "Novidade",
      "title_highlight": "Inverno 2026:",
      "title_main": "Estilo & Conforto",
      "subtitle": "Peças exclusivas...",
      "image_url": "https://...",
      "button_text": "Comprar Agora",
      "button_link": "#produtos",
      "cor_destaque": "#3b82f6"
    }
  ]
  ```

### `GET /configuracoes`
- **Objetivo**: Ler as configurações gerais (útil para os textos da barra do topo, popup promocional, links das redes sociais, etc).
- **Resposta**:
  ```json
  {
    "whatsapp_loja": "5511999999999",
    "link_instagram": "https://...",
    "link_tiktok": "https://...",
    "popup_ativo": true,
    "popup_titulo": "Ganhe 10% OFF",
    "popup_texto": "...",
    "popup_imagem": "https://...",
    "popup_botao_texto": "Pegar cupom",
    "popup_botao_link": "/promo",
    "texto_frete": "Frete grátis acima de R$ 199",
    "texto_brinde": "Brinde fofo no pedido"
  }
  ```

### `GET /categorias`
- **Objetivo**: Listar as categorias de menu (filtros de produtos).
- **Resposta**: Array de objetos com `id` e `nome`.

### `GET /produtos`
- **Objetivo**: Listar catálogo da loja. Opcionalmente passa parâmetros na URL `?categoria=Blusas` para filtrar.
- **Resposta**:
  ```json
  [
    {
      "id": "uuid-aqui",
      "nome": "Cropped Rosa",
      "preco": 89.90,
      "estoque": 10,
      "imagem_url": "https://...",
      "categoria": { "nome": "Blusas" }
    }
  ]
  ```

### `GET /zonas-entrega`
- **Objetivo**: Listar os bairros disponíveis e suas taxas de entrega para cálculo do frete no carrinho. Apenas as zonas com `"ativo": true` devem ser listadas no combobox do App.
- **Resposta**:
  ```json
  [
    { "id": "uuid", "bairro": "Centro", "taxa": 10.00, "ativo": true }
  ]
  ```

### `POST /pedidos`
- **Objetivo**: Finalizar a compra do cliente (Checkout).
- **Importante**: Ao chamar esta rota, o backend automaticamente reduz o estoque, manda WhatsApp para a loja e manda WhatsApp de confirmação com a chave PIX para o cliente. O App Mobile **não precisa** processar o envio da mensagem.
- **Payload Esperado (JSON)**:
  ```json
  {
    "cliente": {
      "nome": "João da Silva",
      "whatsapp": "(11) 99999-9999",  // O backend limpa o número sozinho
      "endereco": "Rua das Flores, 123"
    },
    "itens": [
      {
        "produto_id": "uuid-do-produto",
        "quantidade": 2
      }
    ],
    "zona_entrega_id": "uuid-da-zona",
    "subtotal": 179.80,
    "taxa_entrega": 10.00,
    "total": 189.80,
    "forma_pagamento": "pix"
  }
  ```
- **Resposta**: Retorna o pedido completo com o status `Pendente`.

---

## 4. Endpoints Protegidos (Para a área de Admin do App)

Exigem o Token de Admin (Bearer).

### `GET /pedidos`
- Lista todos os pedidos. 

### `PUT /pedidos/{pedido_id}/status`
- **Objetivo**: Mudar o andamento da entrega.
- **Comportamento Mágico**: Se o status for alterado para `"Confirmado"` ou `"Enviado"`, o backend **dispara automaticamente** uma mensagem no WhatsApp do cliente avisando sobre o andamento.
- **Payload**:
  ```json
  { "status": "Enviado" }
  ```
  *(Status válidos: "Pendente", "Confirmado", "Enviado", "Entregue", "Cancelado")*

### `POST /clientes/disparo`
- **Objetivo**: Enviar uma promoção em massa pelo WhatsApp para todos os clientes.
- **Comportamento Mágico**: O App Mobile só envia o texto da campanha. O backend busca todos os contatos únicos, deduz as duplicatas e envia de 1 em 1 com intervalo de 15 segundos em background.
- **Payload**:
  ```json
  { "mensagem": "🚨 Queima de estoque liberada no App!" }
  ```

### Endpoints de Criação/Edição/Exclusão
- **`POST /produtos`, `PUT /produtos/{id}`, `DELETE /produtos/{id}`**
- **`POST /categorias`, `DELETE /categorias/{id}`**
- **`POST /banners`, `PUT /banners/{id}`, `DELETE /banners/{id}`**
- **`POST /zonas-entrega`, `PUT /zonas-entrega/{id}`, `DELETE /zonas-entrega/{id}`**
- **`PUT /configuracoes`**

*(A documentação OpenAPI detalhada de todos os campos de cada PUT/POST está disponível acessando `GET /docs` do servidor quando ele estiver online)*

---

## 5. Lógicas e Fórmulas Importantes (Atenção, Agente de IA!)

Se você (Agente/Dev) for replicar o painel administrativo no aplicativo Mobile, preste atenção nestes cálculos que devem ser feitos no frontend (Client-side):

1. **Margem e Markup (Cadastro de Produto)**:
   - O lojista digitará `Custo` e `Preço de Venda`. O aplicativo deve exibir:
     - `Lucro Bruto` = `Preço - Custo`
     - `Markup (%)` = `((Preço - Custo) / Custo) * 100` (Mostre isso para o lojista saber o quão acima do custo ele está precificando).
     - `Margem (%)` = `((Preço - Custo) / Preço) * 100` (Mostre isso para o lojista saber o lucro real sobre a venda).

2. **Deduplicação da Contagem de Marketing**:
   - Ao puxar a lista de clientes (`GET /clientes`) para exibir na tela de "Disparo em Massa", filtre contatos usando um *Set* para contar quantos números de WhatsApp **únicos** existem na base antes de mostrar para o lojista, pois o backend usa chaves de clientes separadas para cada compra (ele higieniza o telefone na hora de salvar).

3. **Status do WhatsApp**:
   - Para exibir se o bot do WhatsApp está rodando (Evolution API), faça uma requisição para a rota própria de status e exiba "Conectado" ou apresente o QRCode. Não tente fazer o App Mobile se conectar à API do WhatsApp diretamente, deixe a comunicação entre o `Backend` e o `Evolution API` lidar com isso. O App Mobile apenas chama o backend da loja.
