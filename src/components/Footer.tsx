import { Instagram, Music2, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-pink-100 bg-pink-50/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="font-display text-lg text-primary">
          Annalicia <span className="text-foreground">Modas</span>
        </p>
        <div className="flex gap-3">
          <a
            href="#"
            aria-label="TikTok"
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-primary shadow-sm transition hover:scale-110"
          >
            <Music2 className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-primary shadow-sm transition hover:scale-110"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Feito com <Heart className="h-3 w-3 fill-primary text-primary" /> ©{" "}
          {new Date().getFullYear()} Annalicia Modas
        </p>
      </div>
    </footer>
  );
}
