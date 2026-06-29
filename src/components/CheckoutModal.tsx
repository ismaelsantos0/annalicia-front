import { useState } from "react";
import { X, MessageCircle, MapPin, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "../lib/cart-context";
import { createPedido } from "../lib/api";
import {
  formatWhatsApp,
  isValidWhatsApp,
  onlyDigits,
} from "../lib/whatsapp";
import { formatBRL } from "../lib/products";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CheckoutModal({ open, onClose }: Props) {
  const { items, total, updateQuantity } = useCart();
  
  const mutation = useMutation({
    mutationFn: createPedido,
    onSuccess: (data) => {
      items.forEach((i) => updateQuantity(i.id, 0));
      setSuccess(data.id);
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    whatsapp?: string;
    address?: string;
  }>({});

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Informe seu nome completo";
    if (!isValidWhatsApp(whatsapp))
      next.whatsapp = "WhatsApp inválido. Ex.: (11) 91234-5678";
    if (address.trim().length < 8)
      next.address = "Informe o endereço completo de entrega";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    mutation.mutate({
      cliente_nome: name.trim(),
      cliente_whatsapp: onlyDigits(whatsapp),
      cliente_endereco: address.trim(),
      itens: items.map(i => ({ produto_id: i.id, quantidade: i.quantity }))
    });
  }

  function handleClose() {
    setSuccess(null);
    setName("");
    setWhatsapp("");
    setAddress("");
    setErrors({});
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-pink-950/40 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-background shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-pink-100 px-6 py-4">
          <h2 className="font-display text-xl">
            {success ? "Pedido confirmado 💖" : "Finalizar pedido"}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-pink-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Recebemos seu pedido <span className="font-mono">{success}</span>.
              Em instantes você receberá a confirmação no seu WhatsApp.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Continuar comprando
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
            <div className="rounded-2xl bg-pink-50/60 px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {items.length} item(s)
                </span>
                <span className="font-display text-lg text-primary">
                  {formatBRL(total)}
                </span>
              </div>
            </div>

            <Field
              icon={<User className="h-4 w-4" />}
              label="Nome completo"
              value={name}
              onChange={setName}
              placeholder="Ex.: Ana Souza"
              error={errors.name}
            />

            <Field
              icon={<MessageCircle className="h-4 w-4" />}
              label="WhatsApp (obrigatório)"
              value={whatsapp}
              onChange={(v) => setWhatsapp(formatWhatsApp(v))}
              placeholder="(11) 91234-5678"
              inputMode="tel"
              error={errors.whatsapp}
              hint="Usaremos para confirmar o pedido e enviar o código de rastreio."
            />

            <Field
              icon={<MapPin className="h-4 w-4" />}
              label="Endereço de entrega"
              value={address}
              onChange={setAddress}
              placeholder="Rua, número, bairro, cidade/UF, CEP"
              error={errors.address}
              multiline
            />

            <button
              type="submit"
              disabled={mutation.isPending || items.length === 0}
              className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_25px_-10px_rgba(236,72,153,0.6)] hover:opacity-90 disabled:opacity-40"
            >
              {mutation.isPending ? "Enviando..." : "Confirmar pedido"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  inputMode,
  multiline,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  inputMode?: "tel" | "text" | "email";
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:border-primary ${
            error ? "border-red-400" : "border-pink-100"
          }`}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          className={`w-full rounded-full border bg-white px-4 py-3 text-sm outline-none focus:border-primary ${
            error ? "border-red-400" : "border-pink-100"
          }`}
        />
      )}
      {error ? (
        <span className="mt-1 block text-xs font-medium text-red-500">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}
