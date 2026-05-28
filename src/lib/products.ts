export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Vestidos" | "Blusas";
  image: string;
  stock: number;
};

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const products: Product[] = [
  {
    id: "p1",
    name: "Vestido Midi Seda",
    price: 489.0,
    category: "Vestidos",
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80",
    stock: 12,
  },
  {
    id: "p2",
    name: "Blusa Tricot Manga Longa",
    price: 259.9,
    category: "Blusas",
    image:
      "https://images.unsplash.com/photo-1551489186-cf8726f514f8?auto=format&fit=crop&w=800&q=80",
    stock: 24,
  },
  {
    id: "p3",
    name: "Vestido Longo Linho",
    price: 599.0,
    category: "Vestidos",
    image:
      "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&w=800&q=80",
    stock: 8,
  },
  {
    id: "p4",
    name: "Blusa Cetim Off-White",
    price: 319.0,
    category: "Blusas",
    image:
      "https://images.unsplash.com/photo-1564257577-2d3ee8740ba0?auto=format&fit=crop&w=800&q=80",
    stock: 16,
  },
  {
    id: "p5",
    name: "Vestido Plissado Nude",
    price: 549.0,
    category: "Vestidos",
    image:
      "https://images.unsplash.com/photo-1623609163859-ca93c959b98a?auto=format&fit=crop&w=800&q=80",
    stock: 6,
  },
  {
    id: "p6",
    name: "Blusa Linho Bordada",
    price: 289.0,
    category: "Blusas",
    image:
      "https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=800&q=80",
    stock: 19,
  },
];
