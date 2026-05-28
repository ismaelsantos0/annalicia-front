import { Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="font-serif text-lg tracking-[0.2em] uppercase">
          Boutique Eleganza
        </p>
        <div className="flex gap-5 text-foreground/70">
          <a href="#" aria-label="Instagram" className="hover:text-foreground">
            <Instagram className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-foreground">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-foreground">
            <Twitter className="h-5 w-5" />
          </a>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Boutique Eleganza. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
