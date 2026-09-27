import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Cpu, Activity, Menu, X, Terminal, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & System Status */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#home" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/40 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  DeepGuard <span className="text-accent font-extrabold">AI</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground font-semibold">
                  Dual-CNN Forensic Suite
                </span>
              </div>
            </a>

            {/* Live Model Status Badge (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/60 border border-border/80 text-[11px] font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-muted-foreground">Neural Engine:</span>
              <span className="text-accent font-medium">CUDA Active</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7">
            <button 
              onClick={() => scrollTo("detector")} 
              className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-accent/80" />
              Detector
            </button>
            <button 
              onClick={() => scrollTo("architecture")} 
              className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-accent/80" />
              Dual-CNN Engine
            </button>
            <button 
              onClick={() => scrollTo("forensics")} 
              className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
            >
              Explainability
            </button>
            <button 
              onClick={() => scrollTo("benchmarks")} 
              className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
            >
              Benchmarks
            </button>
            <button 
              onClick={() => scrollTo("research")} 
              className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
            >
              Research
            </button>

            <Button 
              onClick={() => scrollTo("detector")} 
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow font-semibold transition-all hover:scale-105"
            >
              <Terminal className="w-3.5 h-3.5 mr-1.5" />
              Launch Scanner
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:bg-secondary/80"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5 text-accent" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={cn(
          "md:hidden transition-all duration-300 overflow-hidden",
          isMenuOpen ? "max-h-80 pb-6 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}>
          <div className="space-y-3 pt-3 border-t border-border/60">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/40 text-xs font-mono mb-2">
              <span className="h-2 w-2 rounded-full bg-success"></span>
              <span className="text-muted-foreground">Neural Engine:</span>
              <span className="text-accent font-medium">CUDA Active</span>
            </div>
            <button 
              onClick={() => scrollTo("detector")} 
              className="w-full text-left py-2 px-3 rounded-md text-sm font-medium hover:bg-secondary/60 hover:text-accent transition-colors"
            >
              Detector
            </button>
            <button 
              onClick={() => scrollTo("architecture")} 
              className="w-full text-left py-2 px-3 rounded-md text-sm font-medium hover:bg-secondary/60 hover:text-accent transition-colors"
            >
              Dual-CNN Engine
            </button>
            <button 
              onClick={() => scrollTo("forensics")} 
              className="w-full text-left py-2 px-3 rounded-md text-sm font-medium hover:bg-secondary/60 hover:text-accent transition-colors"
            >
              Explainability (Grad-CAM)
            </button>
            <button 
              onClick={() => scrollTo("benchmarks")} 
              className="w-full text-left py-2 px-3 rounded-md text-sm font-medium hover:bg-secondary/60 hover:text-accent transition-colors"
            >
              Performance Benchmarks
            </button>
            <button 
              onClick={() => scrollTo("research")} 
              className="w-full text-left py-2 px-3 rounded-md text-sm font-medium hover:bg-secondary/60 hover:text-accent transition-colors"
            >
              Research Team & Paper
            </button>
            <Button 
              onClick={() => scrollTo("detector")} 
              size="sm" 
              className="w-full bg-accent text-accent-foreground font-semibold mt-2"
            >
              Launch Scanner
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;