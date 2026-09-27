// import { useState } from "react";
// import Navigation from "@/components/Navigation";
// import Hero from "@/components/Hero";
// import FileUpload from "@/components/FileUpload";
// import AnalysisResults from "@/components/AnalysisResults";
// import HowItWorks from "@/components/HowItWorks";
// import { Separator } from "@/components/ui/separator";

// const Index = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [analysisResult, setAnalysisResult] = useState<any>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   const handleFileSelect = async (file: File) => {
//     setSelectedFile(file);
//     setIsAnalyzing(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       const mockResult = {
//         isReal: Math.random() > 0.5,
//         confidence: Math.floor(Math.random() * 30) + 70, // 70-99%
//         processingTime: (Math.random() * 3 + 2).toFixed(1), // 2-5 seconds
//         fileName: file.name,
//         details: {
//           faceDetection: Math.floor(Math.random() * 20) + 80,
//           temporalConsistency: file.type.startsWith('video/') ? Math.floor(Math.random() * 25) + 75 : undefined,
//           artifactDetection: Math.floor(Math.random() * 30) + 70,
//           blinkAnalysis: file.type.startsWith('video/') ? Math.floor(Math.random() * 20) + 80 : undefined,
//         }
//       };
//       setAnalysisResult(mockResult);
//       setIsAnalyzing(false);
//     }, 3000);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />
      
//       <main>
//         <section id="home">
//           <Hero />
//         </section>
        
//         <Separator className="opacity-50" />
        
//         <section className="py-24">
//           <div className="container mx-auto px-6">
//             <div className="max-w-4xl mx-auto">
//               <FileUpload onFileSelect={handleFileSelect} />
              
//               {isAnalyzing && (
//                 <div className="mt-12 text-center">
//                   <div className="inline-flex items-center gap-3 bg-accent/10 text-accent px-6 py-4 rounded-lg border border-accent/20">
//                     <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
//                     Analyzing content for deepfake patterns...
//                   </div>
//                 </div>
//               )}
              
//               {analysisResult && !isAnalyzing && (
//                 <div className="mt-12">
//                   <AnalysisResults result={analysisResult} />
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>
        
//         <Separator className="opacity-50" />
        
//         <section id="how-it-works">
//           <HowItWorks />
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Index;


import { useState } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FileUpload from "@/components/FileUpload";
import AnalysisResults from "@/components/AnalysisResults";
import HowItWorks from "@/components/HowItWorks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  RefreshCw, 
  Eye, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Cpu, 
  Users, 
  ExternalLink,
  Code2,
  Terminal,
  FileCheck2
} from "lucide-react";

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisResult(data);
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent/30 selection:text-accent">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section id="home">
          <Hero />
        </section>
        
        {/* Core Media Scanner / Upload Section */}
        <section className="py-20 relative cyber-grid border-t border-border/60">
          <div className="container mx-auto px-4 sm:px-6">
            {!analysisResult ? (
              /* State 1: Dropzone */
              <FileUpload onAnalysisComplete={handleAnalysisComplete} />
            ) : (
              /* State 2: Forensic Dossier & Action Bar */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                <AnalysisResults result={analysisResult} />
                
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Button 
                    onClick={handleReset} 
                    size="lg"
                    className="gap-2 bg-secondary/80 hover:bg-secondary text-foreground border border-border/80 shadow-md rounded-xl font-mono text-xs px-6"
                  >
                    <RefreshCw className="w-4 h-4 text-accent" /> Scan Another Video
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Architecture & Pipeline Breakdown */}
        <HowItWorks />

        {/* Explainable AI (XAI) & Grad-CAM Section */}
        <section id="forensics" className="py-24 bg-secondary/20 border-t border-border/60">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono mb-4">
                <Eye className="w-3.5 h-3.5" />
                Explainable Artificial Intelligence
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Visualizing Neural Evidence with Grad-CAM
              </h2>
              <p className="text-muted-foreground mt-3 text-base sm:text-lg leading-relaxed">
                Black-box predictions are unacceptable in digital forensics. DeepGuard computes backpropagated gradients on XceptionNet's penultimate convolutional layer to generate human-verifiable attention heatmaps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass-panel border-border/80 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive font-mono font-bold text-sm">
                  HIGH
                </div>
                <h3 className="font-bold text-foreground">Thermal Hotspots (Red / Yellow)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Indicate strong model focus on boundary seams, inconsistent lighting around facial perimeters, and pixel warping caused by GAN blending.
                </p>
              </Card>

              <Card className="glass-panel border-border/80 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-mono font-bold text-sm">
                  MID
                </div>
                <h3 className="font-bold text-foreground">Transitional Zones (Cyan / Green)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Identify micro-texture frequency changes, abnormal eye reflections, and unnatural mouth/lip movements across consecutive frames.
                </p>
              </Card>

              <Card className="glass-panel border-border/80 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground font-mono font-bold text-sm">
                  LOW
                </div>
                <h3 className="font-bold text-foreground">Inert Background (Deep Blue)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Confirms that the network ignores non-facial background clutter, avoiding spurious correlation or biased contextual false positives.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Performance Benchmarks Section */}
        <section id="benchmarks" className="py-24 cyber-dots border-t border-border/60">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono mb-4">
                <Award className="w-3.5 h-3.5" />
                Experimental Evaluation
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Rigorous Empirical Benchmarks
              </h2>
              <p className="text-muted-foreground mt-3 text-base sm:text-lg leading-relaxed">
                Trained and evaluated on the DeepFake Detection Challenge (DFDC) dataset with strict video-level splitting to prevent data leakage.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
              <div className="glass-panel p-6 rounded-2xl border border-border/80 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-accent">96.25%</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-2">Accuracy</div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-border/80 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-foreground">0.99</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-2">AUC-ROC</div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-border/80 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">94.8%</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-2">Precision</div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-border/80 text-center">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-foreground">0.96</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-2">F1 Score</div>
              </div>
            </div>

            {/* Implementation Details Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-border/80">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2 font-mono">
                <Cpu className="w-4 h-4 text-accent" /> Training & Implementation Specifications
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                  <span className="text-muted-foreground block">Deep Learning Stack</span>
                  <span className="font-semibold text-foreground">PyTorch 2.5 + CUDA 12.1</span>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                  <span className="text-muted-foreground block">Precision Mode</span>
                  <span className="font-semibold text-foreground">Automatic Mixed Precision (AMP)</span>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                  <span className="text-muted-foreground block">Target Hardware</span>
                  <span className="font-semibold text-foreground">NVIDIA RTX 4050 (6GB VRAM)</span>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                  <span className="text-muted-foreground block">Input Resolution</span>
                  <span className="font-semibold text-foreground">299 × 299 × 3 RGB</span>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                  <span className="text-muted-foreground block">Mining Strategy</span>
                  <span className="font-semibold text-foreground">Hard Negative Retraining</span>
                </div>
                <div className="p-3 rounded-xl bg-secondary/40 border border-border/60">
                  <span className="text-muted-foreground block">Face Detection</span>
                  <span className="font-semibold text-foreground">MTCNN (Margin 80px)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Academic Research Team & Affiliation Section */}
        <section id="research" className="py-24 bg-secondary/20 border-t border-border/60">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono mb-4">
              <Users className="w-3.5 h-3.5" />
              Academic Research Team
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              DeepGuard AI Research Group
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Department of Computer Science and Engineering • Vishwakarma Institute of Technology (VIT), Pune
            </p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["Aditya Rana", "Nitish Sahu", "Manthan Sali", "Palash Sahuji"].map((name, i) => (
                <div key={i} className="glass-panel p-4 rounded-xl border border-border/70 text-center hover:border-accent/40 transition-colors">
                  <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold text-sm mb-3">
                    {name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="font-bold text-sm text-foreground">{name}</div>
                  <div className="text-[11px] font-mono text-muted-foreground mt-0.5">Researcher</div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 rounded-2xl glass-panel border border-border/80 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-accent uppercase font-bold tracking-wider">Research Publication</span>
                <div className="text-sm font-semibold text-foreground">
                  "DeepGuard: A Lightweight Dual-CNN Ensemble Framework for Deepfake Video Detection"
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  International Conference on Computational Engineering & Technology (ICCET 2026)
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-border/60 bg-background/80 py-10 text-xs font-mono text-muted-foreground">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">DeepGuard AI</span>
            <span>•</span>
            <span>Neural Forensic Defense v2.4</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>PyTorch</span>
            <span>•</span>
            <span>FastAPI</span>
            <span>•</span>
            <span>Vite React</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>

          <div>
            © 2026 VIT Pune. Developed for academic & forensic research.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;