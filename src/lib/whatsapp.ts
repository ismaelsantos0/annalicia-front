// =====================================================
// Stub de integração com API de WhatsApp.
// TODO: substituir o corpo de `sendWhatsAppMessage` pela
// chamada real à API escolhida (Twilio, Meta Cloud API,
// webhook próprio, etc). A assinatura já é a final.
// =====================================================

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Aceita números BR no formato (DDD) 9XXXX-XXXX (celular).
 * Total de 10 ou 11 dígitos após remover máscara.
 */
export function isValidWhatsApp(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length < 10 || digits.length > 13) return false;
  // se vier com 13 dígitos, esperamos prefixo 55 (BR)
  if (digits.length === 13 && !digits.startsWith("55")) return false;
  return true;
}

export function formatWhatsApp(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function toE164BR(value: string): string {
  const d = onlyDigits(value);
  if (d.startsWith("55")) return `+${d}`;
  return `+55${d}`;
}

export type WhatsAppSendResult = {
  ok: boolean;
  to: string;
  message: string;
  sentAt: string;
  // quando integrar com a API real, devolva também o id do provider
  providerId?: string;
  error?: string;
};

/**
 * 🔌 PONTO DE INTEGRAÇÃO
 *
 * Hoje: apenas simula o envio (log no console + delay).
 * Depois: faça aqui o fetch para sua API. Exemplo:
 *
 *   await fetch("/api/whatsapp/send", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ to: toE164BR(phone), message }),
 *   });
 */
export async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<WhatsAppSendResult> {
  const to = toE164BR(phone);
  await new Promise((r) => setTimeout(r, 350));
  // eslint-disable-next-line no-console
  console.log("[WhatsApp:mock] →", to, message);
  return {
    ok: true,
    to,
    message,
    sentAt: new Date().toISOString(),
  };
}
