import { useCart } from "../lib/cart-context";
import { formatBRL, type Product } from "../lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {product.category}
        </p>
        <h3 className="mt-1 font-serif text-lg leading-snug">{product.name}</h3>
        <p className="mt-1 text-sm text-foreground/80">
          {formatBRL(product.price)}
        </p>
        <button
          onClick={() => addItem(product)}
          className="mt-4 border border-primary bg-transparent py-2.5 text-xs uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </article>
  );
}
