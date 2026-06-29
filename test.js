const fetch = require('node-fetch');

async function test() {
  try {
    const res = await fetch("https://annalicia-back-production.up.railway.app/produtos");
    const produtos = await res.json();
    if (!produtos.length) return console.log("sem produtos");
    
    const id = produtos[0].id;
    const body = {
      cliente_nome: "Teste",
      cliente_whatsapp: "11999999999",
      cliente_endereco: "Rua Teste, 123 - Centro, SP",
      tipo_entrega: "retirada",
      taxa_entrega: 0,
      itens: [{ produto_id: id, quantidade: 1 }]
    };

    console.log("enviando:", body);
    const postRes = await fetch("https://annalicia-back-production.up.railway.app/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    
    console.log("status:", postRes.status);
    const data = await postRes.json();
    console.log("data:", JSON.stringify(data, null, 2));

  } catch (e) {
    console.error(e);
  }
}

test();
