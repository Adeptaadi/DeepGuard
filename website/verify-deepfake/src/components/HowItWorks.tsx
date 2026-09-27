import { Card, CardContent } from "@/components/ui/card";
import { 
  Upload, 
  Brain, 
  Shield, 
  Zap, 
  Eye, 
  Cpu, 
  Activity, 
  GitMerge, 
  Sparkles, 
  CheckCircle2,
  Lock,
  BarChart3,
  Layers
} from "lucide-react";

const HowItWorks = () => {
  const pipelineSteps = [
    {
      step: "01",
      icon: Eye,
      title: "MTCNN Dynamic Face Extraction",
      badge: "Margin 80px",
      description: "Extracts facial crops with an expanded 80-pixel margin, ensuring the chin, forehead, ears, and blending boundaries are retained to expose face-swap seams.",
      metric: "299x299 RGB Tensor"
    },
    {
      step: "02",
      icon: Cpu,
      title: "XceptionNet Spatial Analysis",
      badge: "Depthwise Separable",
      description: "Analyzes high-frequency edge gradients, boundary disparities, and warping distortions that conventional CNNs miss.",
      metric: "Spatial Seams & Boundary"
    },
    {
      step: "03",
      icon: Layers,
      title: "EfficientNet-B0 Texture Engine",
      badge: "Compound Scaling",
      description: "Examines microscopic skin pore consistency, compression noise patterns, and lighting anomalies across color channels.",
      metric: "Micro-texture & Noise"
    },
    {
      step: "04",
      icon: Activity,
      title: "Temporal Aggregation & Grad-CAM",
      badge: "Explainable XAI",
      description: "Aggregates frame predictions using consecutive fake streak tracking, while Grad-CAM overlays thermal activation maps proving model decisions.",
      metric: "Streaks & Heatmaps"
    }
  ];

  const architectureComparison = [
    {
      component: "XceptionNet",
      focus: "Spatial artifacts, face boundary seams, warping distortions",
      advantage: "Depthwise separable convolutions capture subtle pixel edge anomalies",
      standaloneAcc: "94.8%"
    },
    {
      component: "EfficientNet-B0",
      focus: "Compression artifacts, high-frequency texture discrepancies",
      advantage: "Compound coefficient scaling optimizes efficiency on consumer hardware",
      standaloneAcc: "93.2%"
    },
    {
      component: "DeepGuard Ensemble",
      focus: "Soft-voting fusion + Temporal consistency streaks",
      advantage: "Eliminates individual model blind spots and reduces false positive variance",
      standaloneAcc: "96.25%"
    }
  ];

  return (
    <div id="architecture" className="py-24 cyber-dots border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono mb-4">
            <Cpu className="w-3.5 h-3.5" />
            Neural Architecture & Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How DeepGuard AI Dissects Synthetic Media
          </h2>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg leading-relaxed">
            Standard single-network detectors frequently fail when faced with high-compression internet videos or high-resolution facial reenactment. DeepGuard employs a complementary dual-stream pipeline.
          </p>
        </div>

        {/* 4-Step Pipeline Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pipelineSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="glass-panel border-border/80 relative overflow-hidden group hover:border-accent/60 hover:shadow-glow transition-all duration-300">
                {/* Accent top border on hover */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    {/* Header with step & badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-muted-foreground bg-secondary/80 px-2 py-1 rounded-md border border-border">
                        {item.step}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="text-[10px] font-mono text-accent uppercase tracking-wider font-semibold">
                        {item.badge}
                      </span>
                      <h3 className="text-lg font-bold text-foreground mt-0.5">{item.title}</h3>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/50 text-[11px] font-mono text-accent/90 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    <span>{item.metric}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dual-CNN Ensemble Decision Matrix Table */}
        <div className="glass-panel rounded-2xl border border-border/80 p-6 sm:p-8 shadow-xl max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border/70 gap-3">
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-accent" />
                Dual-CNN Soft Voting Fusion Matrix
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Combining complementary inductive biases for balanced spatial and frequency detection.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-xs font-mono text-accent font-semibold self-start sm:self-auto">
              AUC-ROC 0.99
            </span>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left text-sm font-mono">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Architecture</th>
                  <th className="pb-3 font-semibold">Detection Specialty</th>
                  <th className="pb-3 font-semibold hidden md:table-cell">Algorithmic Advantage</th>
                  <th className="pb-3 font-semibold text-right">DFDC Val Acc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {architectureComparison.map((row, index) => (
                  <tr key={index} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-4 font-bold text-foreground">
                      {row.component === "DeepGuard Ensemble" ? (
                        <span className="text-accent flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> {row.component}
                        </span>
                      ) : (
                        row.component
                      )}
                    </td>
                    <td className="py-4 text-muted-foreground font-sans text-xs">{row.focus}</td>
                    <td className="py-4 text-muted-foreground font-sans text-xs hidden md:table-cell">{row.advantage}</td>
                    <td className="py-4 text-right font-bold text-foreground">
                      <span className={row.component.includes("Ensemble") ? "text-emerald-400 font-extrabold text-sm" : ""}>
                        {row.standaloneAcc}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;