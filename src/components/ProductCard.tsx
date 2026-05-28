import { useCart } from "../lib/cart-context";
import { formatBRL, type Product } from "../lib/products";
import { Heart } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_15px_40px_-25px_rgba(236,72,153,0.35)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(236,72,153,0.45)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-pink-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            {product.tag}
          </span>
        )}
        <button
          aria-label="Favoritar"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-primary backdrop-blur transition hover:bg-white hover:scale-110"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {product.category}
        </p>
        <h3 className="mt-1 font-display text-lg leading-snug">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold text-primary">
          {formatBRL(product.price)}
        </p>
        <button
          onClick={() => addItem(product)}
          className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-10px_rgba(236,72,153,0.6)] transition hover:opacity-90"
        >
          Comprar
        </button>
      </div>
    </article>
  );
}
