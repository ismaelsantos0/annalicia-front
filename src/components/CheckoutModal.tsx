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
      setSuccessData(data);
    },
    onError: (error) => {
      alert(error.message);
    }
  });

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [successData, setSuccessData] = useState<any | null>(null);
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
    setSuccessData(null);
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
            {successData ? "Pedido confirmado 💖" : "Finalizar pedido"}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-pink-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {successData ? (
          <div className="px-6 py-8 text-center flex flex-col items-center">
            <p className="text-sm text-muted-foreground">
              Recebemos seu pedido <span className="font-mono">#{successData.id.split('-')[0]}</span>.
            </p>
            <div className="my-6 w-full rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-left">
              <h3 className="font-semibold text-yellow-800 text-sm mb-2">Finalize seu pagamento:</h3>
              <p className="text-xs text-yellow-700 mb-3">Escaneie o QR Code ou copie o código abaixo e pague no seu aplicativo do banco via <b>PIX Copia e Cola</b>. O pedido será processado assim que for aprovado.</p>
              
              <div className="mb-4 flex justify-center bg-white rounded-xl p-4 border border-yellow-100">
                <img 
                  src={`https://quickchart.io/qr?text=${encodeURIComponent(successData.pix_copia_cola)}&size=200`} 
                  alt="QR Code PIX" 
                  className="w-40 h-40 object-contain"
                />
              </div>

              <div className="relative">
                <textarea 
                  readOnly 
                  value={successData.pix_copia_cola} 
                  className="w-full text-xs font-mono p-3 rounded-xl bg-white border border-yellow-200 outline-none resize-none break-all"
                  rows={4}
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(successData.pix_copia_cola);
                    alert("Código PIX copiado!");
                  }}
                  className="absolute right-2 bottom-2 bg-yellow-200 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full hover:bg-yellow-300"
                >
                  Copiar
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Em instantes você receberá os detalhes no seu WhatsApp.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 rounded-full bg-primary w-full py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-md"
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
