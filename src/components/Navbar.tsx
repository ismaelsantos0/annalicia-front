import { Link } from "@tanstack/react-router";
import { ShoppingBag, LayoutDashboard } from "lucide-react";
import { useCart } from "../lib/cart-context";

export function Navbar() {
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-4 sm:px-6 lg:px-8">
        <nav className="hidden gap-6 text-sm tracking-wide text-foreground/80 md:flex">
          <Link to="/" className="hover:text-foreground">Início</Link>
          <a href="#vestidos" className="hover:text-foreground">Vestidos</a>
          <a href="#blusas" className="hover:text-foreground">Blusas</a>
        </nav>

        <Link
          to="/"
          className="col-start-2 text-center font-serif text-xl tracking-[0.2em] uppercase text-foreground md:text-2xl"
        >
          Boutique Eleganza
        </Link>

        <div className="col-start-3 flex items-center justify-end gap-4">
          <Link
            to="/admin"
            className="hidden items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Painel Admin
          </Link>
          <button
            onClick={openCart}
            aria-label="Abrir carrinho"
            className="relative rounded-full p-2 transition hover:bg-secondary"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav className="flex justify-center gap-6 border-t border-border px-4 py-2 text-xs tracking-wider text-foreground/70 md:hidden">
        <Link to="/">Início</Link>
        <a href="#vestidos">Vestidos</a>
        <a href="#blusas">Blusas</a>
        <Link to="/admin">Admin</Link>
      </nav>
    </header>
  );
}
