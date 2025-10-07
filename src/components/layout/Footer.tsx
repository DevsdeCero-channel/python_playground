import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-6 border-t bg-background/95">
      <div className="w-full md:max-w-[85%] mx-auto px-4 md:px-0">
        <div className="flex flex-col items-center justify-center gap-4">
          <a
            href="https://www.youtube.com/@DevsdeCero"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            YouTube
          </a>
          <p className="text-[0.6rem] sm:text-xs text-muted-foreground text-center flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} De DevsdeCero con <Heart className="h-4 w-4 text-red-500 fill-current" />. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
