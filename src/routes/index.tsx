import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Truck, Gift } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CartDrawer } from "../components/CartDrawer";
import { ProductCard } from "../components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { fetchProdutos, fetchCategorias } from "../lib/api";
import { useState } from "react";
import type { Product } from "../lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Annalicia Modas — Coleção Primavera" },
      {
        name: "description",
        content:
          "Moda jovem aesthetic. Looks coquette, vestidos floral e tops fofos para você ser você mesma.",
      },
    ],
  }),
  component: Storefront,
});

function Storefront() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["produtos"],
    queryFn: fetchProdutos,
  });
  const { data: categorias = [] } = useQuery({
    queryKey: ["categorias"],
    queryFn: fetchCategorias,
  });

  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  const filteredProducts = activeCategory === "Todos" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-pink-200/50 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-emerald-100 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-emerald-700">
              <Sparkles className="h-3 w-3" />
              Drop de primavera ✨
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Coleção Primavera:{" "}
              <span className="text-primary">Seja Você Mesma!</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Looks fofos, coquette e cheios de personalidade pra você arrasar
              em qualquer rolê. Encontre a peça que combina com a sua vibe. 💕
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#looks"
                className="rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-[0_15px_30px_-10px_rgba(236,72,153,0.55)] transition hover:scale-105"
              >
                Ver Looks
              </a>
              <a
                href="#novidades"
                className="rounded-full border-2 border-primary/20 bg-white px-6 py-3.5 text-sm font-semibold text-primary transition hover:bg-pink-50"
              >
                Novidades
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" /> Frete grátis acima de R$ 199
              </span>
              <span className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" /> Brinde fofo no pedido
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-pink-200 via-pink-100 to-emerald-100 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_30px_60px_-20px_rgba(236,72,153,0.4)]">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
                alt="Modelo com look da coleção primavera"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white px-4 py-3 shadow-lg">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Best seller
              </p>
              <p className="font-display text-primary">+1.2k vendidos 💖</p>
            </div>
          </div>
        </div>
      </section>

      {/* Looks */}
      <section
        id="looks"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Vitrine
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Looks que tão bombando 🌸
            </h2>
          </div>
          <a
            href="#novidades"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Ver tudo →
          </a>
        </div>

        {/* Categorias Filtro */}
        <div className="mb-10 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveCategory("Todos")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeCategory === "Todos"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-pink-50 text-foreground hover:bg-pink-100 hover:text-primary"
            }`}
          >
            Todos
          </button>
          {categorias.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.nome)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeCategory === cat.nome
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-pink-50 text-foreground hover:bg-pink-100 hover:text-primary"
              }`}
            >
              {cat.nome}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p className="text-muted-foreground">Carregando looks...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-muted-foreground">Nenhum look nessa categoria ainda.</p>
          ) : (
            filteredProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          )}
        </div>

        {filteredProducts.length > 3 && (
          <div id="novidades" className="mt-20 mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Tem mais
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Descubra {activeCategory !== "Todos" ? activeCategory : "Mais Looks"} ✨
            </h2>
          </div>
        )}
        {filteredProducts.length > 3 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.slice(3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
