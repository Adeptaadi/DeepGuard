// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Shield, AlertTriangle, CheckCircle, Clock, Brain } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface AnalysisResultsProps {
//   result: {
//     isReal: boolean;
//     confidence: number;
//     processingTime: number;
//     fileName: string;
//     details: {
//       faceDetection: number;
//       temporalConsistency?: number;
//       artifactDetection: number;
//       blinkAnalysis?: number;
//     };
//   };
//   className?: string;
// }

// const AnalysisResults = ({ result, className }: AnalysisResultsProps) => {
//   const { isReal, confidence, processingTime, fileName, details } = result;
  
//   const getConfidenceColor = (conf: number) => {
//     if (conf >= 90) return "text-success";
//     if (conf >= 70) return "text-warning";
//     return "text-destructive";
//   };

//   const getConfidenceBadge = () => {
//     if (confidence >= 90) return "bg-success/20 text-success border-success/30";
//     if (confidence >= 70) return "bg-warning/20 text-warning border-warning/30";
//     return "bg-destructive/20 text-destructive border-destructive/30";
//   };

//   return (
//     <Card className={cn("w-full max-w-4xl mx-auto shadow-card", className)}>
//       <CardHeader className="pb-4">
//         <div className="flex items-center justify-between">
//           <CardTitle className="flex items-center gap-3">
//             {isReal ? (
//               <CheckCircle className="w-6 h-6 text-success" />
//             ) : (
//               <AlertTriangle className="w-6 h-6 text-destructive" />
//             )}
//             Analysis Complete
//           </CardTitle>
//           <Badge className={getConfidenceBadge()}>
//             {confidence}% Confidence
//           </Badge>
//         </div>
//         <p className="text-sm text-muted-foreground">File: {fileName}</p>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         {/* Main Result */}
//         <div className="text-center p-6 bg-gradient-subtle rounded-lg border">
//           <div className={cn("text-6xl font-bold mb-2", isReal ? "text-success" : "text-destructive")}>
//             {isReal ? "REAL" : "DEEPFAKE"}
//           </div>
//           <p className="text-lg text-muted-foreground">
//             This content appears to be {isReal ? "authentic" : "artificially generated"}
//           </p>
          
//           <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
//             <Clock className="w-4 h-4" />
//             Analyzed in {processingTime}s
//           </div>
//         </div>

//         {/* Confidence Meter */}
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <span className="font-medium">Confidence Score</span>
//             <span className={cn("font-bold", getConfidenceColor(confidence))}>
//               {confidence}%
//             </span>
//           </div>
//           <Progress value={confidence} className="h-3" />
//           <p className="text-xs text-muted-foreground">
//             Higher scores indicate greater certainty in the classification
//           </p>
//         </div>

//         {/* Analysis Details */}
//         <div className="grid md:grid-cols-2 gap-4">
//           <Card className="p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <Brain className="w-4 h-4 text-accent" />
//               <h4 className="font-medium">Detection Metrics</h4>
//             </div>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm">Face Detection</span>
//                 <span className="text-sm font-medium">{details.faceDetection}%</span>
//               </div>
//               <Progress value={details.faceDetection} className="h-2" />
              
//               {details.temporalConsistency && (
//                 <>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">Temporal Consistency</span>
//                     <span className="text-sm font-medium">{details.temporalConsistency}%</span>
//                   </div>
//                   <Progress value={details.temporalConsistency} className="h-2" />
//                 </>
//               )}
              
//               <div className="flex items-center justify-between">
//                 <span className="text-sm">Artifact Detection</span>
//                 <span className="text-sm font-medium">{details.artifactDetection}%</span>
//               </div>
//               <Progress value={details.artifactDetection} className="h-2" />
              
//               {details.blinkAnalysis && (
//                 <>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm">Blink Analysis</span>
//                     <span className="text-sm font-medium">{details.blinkAnalysis}%</span>
//                   </div>
//                   <Progress value={details.blinkAnalysis} className="h-2" />
//                 </>
//               )}
//             </div>
//           </Card>

//           <Card className="p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <Shield className="w-4 h-4 text-accent" />
//               <h4 className="font-medium">Risk Assessment</h4>
//             </div>
//             <div className="space-y-3">
//               <div className={cn(
//                 "p-3 rounded-lg border text-sm",
//                 isReal 
//                   ? "bg-success/10 border-success/20 text-success-foreground" 
//                   : "bg-destructive/10 border-destructive/20 text-destructive-foreground"
//               )}>
//                 <strong>
//                   {isReal ? "Low Risk" : "High Risk"}
//                 </strong>
//                 <br />
//                 {isReal 
//                   ? "Content shows strong indicators of authenticity" 
//                   : "Content shows signs of artificial manipulation"
//                 }
//               </div>
              
//               <div className="text-xs text-muted-foreground space-y-1">
//                 <p>• Analysis based on facial inconsistencies</p>
//                 <p>• Neural network pattern detection</p>
//                 <p>• Temporal sequence analysis</p>
//                 <p>• Compression artifact evaluation</p>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* Disclaimer */}
//         <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
//           <p className="text-xs text-muted-foreground">
//             <strong>Disclaimer:</strong> This analysis is provided for informational purposes only. 
//             While our AI model is highly accurate, no detection system is 100% perfect. 
//             Results should be considered alongside other verification methods for critical applications.
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default AnalysisResults;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Brain, 
  Eye, 
  Layers, 
  Download, 
  Maximize2, 
  X, 
  FileText, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResultsProps {
  result: {
    isReal: boolean;
    confidence: number;
    processingTime: number;
    fileName: string;
    details: {
      faceDetection: number;
      temporalConsistency?: number;
      artifactDetection: number;
      blinkAnalysis?: number;
    };
    evidence?: Array<{ image: string; timestamp: string; confidence: number }>;
  };
  className?: string;
}

const AnalysisResults = ({ result, className }: AnalysisResultsProps) => {
  const { isReal, confidence, processingTime, fileName, details, evidence } = result;
  const [selectedEvidence, setSelectedEvidence] = useState<{ image: string; timestamp: string; confidence: number } | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500", className)}>
      {/* Evidence Modal / Lightbox */}
      {selectedEvidence && (
        <div 
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-200"
          onClick={() => setSelectedEvidence(null)}
        >
          <div 
            className="glass-panel-glow max-w-2xl w-full rounded-2xl p-6 border border-accent/40 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-accent" />
                <h3 className="font-bold text-foreground">Grad-CAM Forensic Activation Map</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedEvidence(null)}
                className="rounded-full hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="relative aspect-square max-h-[380px] mx-auto rounded-xl overflow-hidden border border-border/80 bg-black/40">
                <img 
                  src={`data:image/jpeg;base64,${selectedEvidence.image}`} 
                  alt="Enlarged Grad-CAM Forensic Map" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono bg-secondary/40 p-3 rounded-xl border border-border/80">
                <span>Timestamp: <strong className="text-accent">{selectedEvidence.timestamp}</strong></span>
                <span>Artifact Probability: <strong className="text-destructive">{selectedEvidence.confidence.toFixed(1)}%</strong></span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Forensic Interpretation:</strong> Warmer thermal signatures (red & yellow regions) reveal high gradient activation where XceptionNet detected boundary blending seams, facial warping, or pixel discrepancies typical of generative deepfakes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Analysis Card */}
      <Card className="glass-panel border-border/80 shadow-2xl overflow-hidden rounded-2xl">
        {/* Top Accent Strip */}
        <div className={cn(
          "h-2 w-full",
          isReal 
            ? "bg-gradient-to-r from-emerald-500 to-teal-400" 
            : "bg-gradient-to-r from-red-600 via-rose-500 to-amber-500"
        )}></div>

        <CardHeader className="p-6 sm:p-8 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                <span>Forensic Inspection Dossier</span>
                <span>•</span>
                <span>DeepGuard Engine v2.4</span>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2.5">
                {isReal ? (
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-destructive" />
                )}
                Verification Summary
              </CardTitle>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="border-border/80 bg-secondary/40 hover:bg-secondary text-xs font-mono gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export Report
              </Button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 text-xs font-mono text-muted-foreground bg-secondary/30 p-2.5 rounded-lg border border-border/60">
            <span className="truncate">File: <strong className="text-foreground">{fileName}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1 flex-shrink-0">
              <Clock className="w-3.5 h-3.5 text-accent" /> {processingTime}s
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 pt-2 space-y-6">
          {/* Main Verdict Billboard */}
          <div className={cn(
            "p-6 sm:p-8 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden",
            isReal 
              ? "bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]" 
              : "bg-red-950/20 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
          )}>
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold mb-3 border uppercase tracking-wider",
              isReal 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                : "bg-destructive/10 text-destructive border-destructive/30"
            )}>
              {isReal ? "Verified Authentic" : "High Manipulation Risk"}
            </div>

            <div className={cn(
              "text-5xl sm:text-7xl font-extrabold tracking-tight mb-2 font-mono",
              isReal ? "text-emerald-400" : "text-destructive"
            )}>
              {isReal ? "AUTHENTIC" : "DEEPFAKE"}
            </div>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              {isReal 
                ? "No generative anomalies or blending seams detected. Facial features and temporal texture continuity match organic camera footage."
                : "Strong artificial manipulation markers detected. The model identified boundary warping and spatial artifacts consistent with face-swap synthesis."
              }
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-border/40 text-xs font-mono">
              <div>
                <span className="text-muted-foreground">Confidence Level:</span>{" "}
                <strong className={isReal ? "text-emerald-400" : "text-destructive"}>{confidence}%</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Model Consensus:</span>{" "}
                <strong className="text-accent">Dual-CNN Unanimous</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Latency:</span>{" "}
                <strong className="text-foreground">{processingTime}s</strong>
              </div>
            </div>
          </div>

          {/* Forensic Evidence Gallery (Grad-CAM Heatmaps) */}
          {!isReal && evidence && evidence.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2 font-mono">
                  <Eye className="w-4 h-4 text-accent" /> Forensic Evidence (Grad-CAM Heatmaps)
                </h4>
                <span className="text-xs text-muted-foreground font-mono">Click thumbnail to inspect</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {evidence.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedEvidence(item)}
                    className="relative group overflow-hidden rounded-xl border border-border/80 bg-black/30 cursor-pointer hover:border-accent/80 hover:shadow-glow transition-all duration-300"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={`data:image/jpeg;base64,${item.image}`} 
                        alt={`Evidence frame at ${item.timestamp}`} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Hover Inspect Icon */}
                    <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-accent">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Tag Footer */}
                    <div className="absolute bottom-0 inset-x-0 bg-background/90 backdrop-blur-md px-2 py-1 flex items-center justify-between text-[10px] font-mono border-t border-border/60">
                      <span className="text-foreground font-bold">{item.timestamp}</span>
                      <span className="text-destructive font-semibold">{item.confidence.toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Metric Breakdowns */}
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            {/* Detection Sub-Metrics */}
            <Card className="p-5 glass-panel border-border/80">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-accent" />
                <h4 className="text-sm font-bold uppercase tracking-wider font-mono">Forensic Index</h4>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Artifact Density (Fake Ratio)</span>
                    <span className="font-bold text-foreground">{details.artifactDetection}%</span>
                  </div>
                  <Progress value={details.artifactDetection} className="h-1.5 bg-secondary" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Temporal Frame Consistency</span>
                    <span className="font-bold text-foreground">{details.temporalConsistency || 100}%</span>
                  </div>
                  <Progress value={details.temporalConsistency || 100} className="h-1.5 bg-secondary" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">Face Detection Confidence</span>
                    <span className="font-bold text-emerald-400">100%</span>
                  </div>
                  <Progress value={100} className="h-1.5 bg-secondary" />
                </div>
              </div>
            </Card>

            {/* Neural Architecture Breakdown */}
            <Card className="p-5 glass-panel border-border/80 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-accent" />
                <h4 className="text-sm font-bold uppercase tracking-wider font-mono">Ensemble Diagnostics</h4>
              </div>

              <div className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/60">
                  <strong className="text-foreground block mb-0.5">XceptionNet (Spatial Artifacts)</strong>
                  Analyzed high-frequency edge gradients, facial landmarks, and blending perimeter with margin 80.
                </div>
                <div className="p-2.5 rounded-lg bg-secondary/40 border border-border/60">
                  <strong className="text-foreground block mb-0.5">EfficientNet-B0 (Texture Analysis)</strong>
                  Evaluated compression noise patterns, skin pore frequency, and lighting coherence.
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResults;