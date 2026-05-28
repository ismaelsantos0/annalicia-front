import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { formatBRL } from "../lib/products";

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, total } =
    useCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-foreground/30 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-serif text-xl tracking-wide">Seu Carrinho</h2>
          <button
            onClick={closeCart}
            aria-label="Fechar carrinho"
            className="rounded-full p-2 hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="mt-20 text-center text-sm text-muted-foreground">
              Seu carrinho está vazio.
            </p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-20 flex-none rounded object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-serif text-base leading-tight">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label="Remover"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatBRL(item.price)}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 border border-border">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1.5 hover:bg-secondary"
                          aria-label="Diminuir"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1.5 hover:bg-secondary"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-medium">
                        {formatBRL(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm uppercase tracking-widest text-muted-foreground">
              Total
            </span>
            <span className="font-serif text-2xl">{formatBRL(total)}</span>
          </div>
          <button
            disabled={items.length === 0}
            onClick={() => alert("Redirecionando para checkout")}
            className="w-full bg-primary py-3.5 text-sm uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
          >
            Ir para o Pagamento
          </button>
        </div>
      </aside>
    </>
  );
}
