export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Tops" | "Vestidos" | "Saias" | "Conjuntos" | "Geral";
  images: string[];
  stock: number;
  tag?: string;
};

export const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const products: Product[] = [
  {
    id: "p1",
    name: "Cropped Borboleta",
    price: 89.9,
    category: "Tops",
    images: [
      "https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 24,
    tag: "Trend",
  },
  {
    id: "p2",
    name: "Saia Plissada Rosa",
    price: 129.9,
    category: "Saias",
    images: [
      "https://images.unsplash.com/photo-1577900232427-18219b9166a0?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 18,
    tag: "Novo",
  },
  {
    id: "p3",
    name: "Vestido Floral Aesthetic",
    price: 189.9,
    category: "Vestidos",
    images: [
      "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 9,
    tag: "Hot",
  },
  {
    id: "p4",
    name: "Conjunto Tricot Pastel",
    price: 219.0,
    category: "Conjuntos",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 14,
  },
  {
    id: "p5",
    name: "Top Coquette Laço",
    price: 79.9,
    category: "Tops",
    images: [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 31,
    tag: "Trend",
  },
  {
    id: "p6",
    name: "Vestido Midi Cottage",
    price: 169.9,
    category: "Vestidos",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    ],
    stock: 7,
  },
];
