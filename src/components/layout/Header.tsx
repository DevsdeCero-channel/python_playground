import { PythonIcon } from "@/components/icons/PythonIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="w-full md:max-w-[85%] mx-auto px-4 md:px-0">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <PythonIcon className="h-8 w-8" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Python Playground
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary hidden">
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                Visitar Web
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
