import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "./cart-context";

export type Customer = {
  id: string;
  name: string;
  whatsapp: string; // somente dígitos
  address: string;
  createdAt: string;
};

export type Order = {
  id: string;
  customerId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
};

type CustomersContextValue = {
  customers: Customer[];
  orders: Order[];
  /**
   * Cria/atualiza cliente (chave: whatsapp) e registra o pedido.
   * No backend real (Lovable Cloud / API) substituir por insert no banco.
   */
  registerOrder: (input: {
    name: string;
    whatsapp: string; // dígitos
    address: string;
    items: CartItem[];
    total: number;
  }) => { customer: Customer; order: Order };
};

const CustomersContext = createContext<CustomersContextValue | null>(null);

const LS_CUSTOMERS = "annalicia.customers.v1";
const LS_ORDERS = "annalicia.orders.v1";

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCustomers(load<Customer[]>(LS_CUSTOMERS, []));
    setOrders(load<Order[]>(LS_ORDERS, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(LS_CUSTOMERS, JSON.stringify(customers));
  }, [customers, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(LS_ORDERS, JSON.stringify(orders));
  }, [orders, hydrated]);

  const value = useMemo<CustomersContextValue>(
    () => ({
      customers,
      orders,
      registerOrder: ({ name, whatsapp, address, items, total }) => {
        const now = new Date().toISOString();
        let customer = customers.find((c) => c.whatsapp === whatsapp);
        if (!customer) {
          customer = {
            id: `c_${Date.now().toString(36)}`,
            name,
            whatsapp,
            address,
            createdAt: now,
          };
          setCustomers((prev) => [...prev, customer!]);
        } else {
          // atualiza dados de entrega mais recentes
          const updated = { ...customer, name, address };
          customer = updated;
          setCustomers((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          );
        }
        const order: Order = {
          id: `o_${Date.now().toString(36)}`,
          customerId: customer.id,
          items,
          total,
          createdAt: now,
        };
        setOrders((prev) => [order, ...prev]);
        return { customer, order };
      },
    }),
    [customers, orders]
  );

  return (
    <CustomersContext.Provider value={value}>
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomersContext);
  if (!ctx)
    throw new Error("useCustomers deve ser usado dentro de CustomersProvider");
  return ctx;
}
