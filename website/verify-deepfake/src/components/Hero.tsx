import { Button } from "@/components/ui/button";
import { Upload, Shield, Zap, Sparkles, CheckCircle2, Cpu, Eye, FileVideo } from "lucide-react";
import heroShield from "@/assets/hero-shield.jpg";

const Hero = () => {
  const scrollToDetector = () => {
    const el = document.getElementById("detector");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToArch = () => {
    const el = document.getElementById("architecture");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden cyber-grid">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text / Value Proposition */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-secondary/80 border border-accent/30 text-xs font-mono text-accent shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
              <span>Research Framework • Dual-CNN Ensemble v2.4</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Enterprise <span className="bg-gradient-to-r from-accent via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Deepfake Detection</span> & Forensic Intelligence
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Combines <strong>XceptionNet</strong> spatial artifact tracking and <strong>EfficientNet-B0</strong> texture consistency analysis to expose AI-generated synthetic media. Backed by MTCNN face extraction, temporal streaks, and Grad-CAM explainable visual evidence.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={scrollToDetector}
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow font-bold text-sm tracking-wide px-7 py-6 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2.5"
              >
                <Upload className="w-4 h-4" />
                Upload Media for Analysis
              </Button>
              <Button 
                onClick={scrollToArch}
                variant="outline" 
                size="lg"
                className="border-border/80 bg-secondary/40 hover:bg-secondary/90 hover:text-accent font-medium text-sm py-6 rounded-xl transition-all"
              >
                <Cpu className="w-4 h-4 mr-2 text-accent" />
                Explore Architecture
              </Button>
            </div>

            {/* Micro Stats Grid */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-border/60 max-w-lg mx-auto lg:mx-0">
              <div className="text-left">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-accent">96.25%</div>
                <div className="text-xs text-muted-foreground font-medium mt-0.5">Ensemble Accuracy</div>
              </div>
              <div className="text-left border-l border-border/60 pl-4">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">0.99</div>
                <div className="text-xs text-muted-foreground font-medium mt-0.5">AUC-ROC Metric</div>
              </div>
              <div className="text-left border-l border-border/60 pl-4">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">Grad-CAM</div>
                <div className="text-xs text-muted-foreground font-medium mt-0.5">Explainable AI</div>
              </div>
            </div>
          </div>

          {/* Right Visual Forensic Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-accent/30 via-cyan-500/20 to-emerald-500/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-1000"></div>

              {/* Main Forensic Showcase Card */}
              <div className="relative glass-panel rounded-2xl border border-border/80 p-5 sm:p-6 shadow-2xl overflow-hidden">
                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
                    <div className="w-3 h-3 rounded-full bg-warning/80"></div>
                    <div className="w-3 h-3 rounded-full bg-success/80"></div>
                    <span className="ml-2 text-xs font-mono text-muted-foreground">deepguard-inspector.xai</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-[10px] font-mono text-accent uppercase font-bold tracking-wider">
                    Dual Engine Active
                  </span>
                </div>

                {/* Media Preview Box with Scanning Reticle */}
                <div className="relative mt-4 aspect-video rounded-xl overflow-hidden border border-border/60 bg-muted/40 flex items-center justify-center">
                  <img
                    src={heroShield}
                    alt="Deepfake forensic scanning visualization"
                    className="w-full h-full object-cover opacity-85"
                  />

                  {/* Laser Scan Line */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_15px_#38bdf8] animate-scanline"></div>

                  {/* Corner Targeting Reticles */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-accent"></div>
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-accent"></div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-accent"></div>
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-accent"></div>

                  {/* Detection Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-background/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border/60 text-xs font-mono">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-accent" /> MTCNN Margin 80
                    </span>
                    <span className="text-emerald-400 font-semibold">Face Locked [299x299]</span>
                  </div>
                </div>

                {/* Forensic Sub-metrics */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                    <div className="text-[11px] text-muted-foreground font-mono">XceptionNet [Spatial]</div>
                    <div className="text-sm font-bold text-foreground mt-0.5 flex items-center justify-between">
                      <span>Face Seams</span>
                      <span className="text-accent font-mono text-xs">Evaluated</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                    <div className="text-[11px] text-muted-foreground font-mono">EfficientNet [Texture]</div>
                    <div className="text-sm font-bold text-foreground mt-0.5 flex items-center justify-between">
                      <span>Compression</span>
                      <span className="text-accent font-mono text-xs">Evaluated</span>
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-muted-foreground px-1">
                  <span>Inference Latency: ~18ms</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready for Analysis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
