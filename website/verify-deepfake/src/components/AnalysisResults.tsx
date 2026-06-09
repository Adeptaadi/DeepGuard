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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, Clock, Brain, Eye } from "lucide-react";
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
  
  const getConfidenceBadge = () => {
    if (confidence >= 90) return "bg-success/20 text-success border-success/30";
    if (confidence >= 70) return "bg-warning/20 text-warning border-warning/30";
    return "bg-destructive/20 text-destructive border-destructive/30";
  };

  return (
    <Card className={cn("w-full max-w-4xl mx-auto shadow-card animate-in fade-in zoom-in duration-500", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            {isReal ? <CheckCircle className="w-6 h-6 text-success" /> : <AlertTriangle className="w-6 h-6 text-destructive" />}
            Analysis Complete
          </CardTitle>
          <Badge className={getConfidenceBadge()}>{confidence}% Confidence</Badge>
        </div>
        <p className="text-sm text-muted-foreground">File: {fileName}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Result */}
        <div className={cn("text-center p-8 rounded-xl border-2 border-dashed", isReal ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20")}>
          <div className={cn("text-6xl font-bold mb-2 tracking-tight", isReal ? "text-success" : "text-destructive")}>
            {isReal ? "REAL" : "FAKE"}
          </div>
          <p className="text-lg text-muted-foreground">
            {isReal ? "No manipulation detected." : "High probability of manipulation detected."}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" /> Analyzed in {processingTime}s
          </div>
        </div>

        {/* Evidence Grid (Heatmaps) */}
        {!isReal && evidence && evidence.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent" /> Forensic Evidence (Heatmaps)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {evidence.map((item, idx) => (
                <div key={idx} className="relative group overflow-hidden rounded-lg border border-border">
                  <img 
                    src={`data:image/jpeg;base64,${item.image}`} 
                    alt="Evidence" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 text-center backdrop-blur-sm">
                    {item.timestamp} • {item.confidence.toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-accent" />
              <h4 className="font-medium">Detection Metrics</h4>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm"><span>Artifacts</span><span>{details.artifactDetection}%</span></div>
                <Progress value={details.artifactDetection} className="h-2" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm"><span>Consistency</span><span>{details.temporalConsistency}%</span></div>
                <Progress value={details.temporalConsistency} className="h-2" />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-accent" />
              <h4 className="font-medium">Model Assessment</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This analysis used an ensemble of <strong>XceptionNet</strong> and <strong>EfficientNet</strong>. 
              {isReal ? " Both models agreed the footage is authentic." : " The models detected spatial anomalies consistent with DeepFaceLab generation."}
            </p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResults;