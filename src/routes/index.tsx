import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { CartDrawer } from "../components/CartDrawer";
import { ProductCard } from "../components/ProductCard";
import { products } from "../lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Boutique Eleganza — Nova Coleção Outono" },
      {
        name: "description",
        content:
          "Moda feminina elegante e atemporal. Descubra a nova coleção outono da Boutique Eleganza.",
      },
    ],
  }),
  component: Storefront,
});

function Storefront() {
  const vestidos = products.filter((p) => p.category === "Vestidos");
  const blusas = products.filter((p) => p.category === "Blusas");

  return (
    <div className="min-h-screen">
      <Navbar />
      <CartDrawer />

      {/* Hero */}
      <section className="relative">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-16 lg:py-32">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Edição Outono 2026
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Nova Coleção <em className="not-italic block text-accent">Outono</em>
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              Peças atemporais, tecidos nobres e silhuetas que celebram a
              feminilidade discreta. Vista o seu próximo capítulo.
            </p>
            <div className="mt-10">
              <a
                href="#vitrine"
                className="inline-block bg-primary px-10 py-4 text-xs uppercase tracking-[0.3em] text-primary-foreground transition hover:opacity-90"
              >
                Ver Peças
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-auto">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80"
              alt="Modelo vestindo peça da coleção outono"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Vitrine */}
      <section id="vitrine" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div id="vestidos" className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Vestidos
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            Silhuetas da estação
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {vestidos.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div id="blusas" className="mb-12 mt-24 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Blusas
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            Essenciais elegantes
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {blusas.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
