import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileVideo, 
  X, 
  AlertCircle, 
  Loader2, 
  ShieldAlert, 
  CheckCircle, 
  Cpu, 
  Eye, 
  Sparkles,
  Layers,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { analyzeMediaWithFallback } from "@/lib/api";

interface FileUploadProps {
  onAnalysisComplete: (data: any) => void;
  className?: string;
}

const ANALYSIS_STAGES = [
  { label: "Decoding video frames & sampling sequence...", progress: 20, icon: FileVideo },
  { label: "Face Detection & Alignment with boundary margin...", progress: 45, icon: Eye },
  { label: "Dual-CNN Inference: XceptionNet (Spatial) + EfficientNet (Texture)...", progress: 70, icon: Cpu },
  { label: "Computing temporal streaks & synthesizing Grad-CAM heatmaps...", progress: 92, icon: Activity }
];

const FileUpload = ({ onAnalysisComplete, className }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [stageMessage, setStageMessage] = useState<string>("");

  // Smooth client-side transmission pacing: bounded strictly between 8% and 18%
  // Strictly monotonic: only increments while waiting for server response, NEVER decreases, NEVER exceeds 18%
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 18) return prev;
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const maxSize = 150 * 1024 * 1024; // 150MB
    const validExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv', '.jpg', '.jpeg', '.png'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (file.size > maxSize) {
      setError("File exceeds 150MB limit. Please provide a shorter video clip.");
      return false;
    }
    
    if (!validExtensions.includes(fileExt) && !file.type.startsWith('video/') && !file.type.startsWith('image/')) {
      setError("Unsupported format. Please upload MP4, AVI, MOV, WebM, or PNG/JPEG.");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) setSelectedFile(file);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError("");
    setAnalysisProgress(8);
    setCurrentStageIdx(0);
    setStageMessage("Transmitting media to forensic inference engine...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Connect to Primary Render Cloud Backend with Localhost Fallback and live progress mapping
      const { data, usedUrl } = await analyzeMediaWithFallback(
        formData,
        (progress, stageIdx, msg) => {
          // Strictly monotonic progress: can NEVER decrease or backtrack
          setAnalysisProgress((prev) => Math.max(prev, progress));
          if (typeof stageIdx === "number" && stageIdx >= 0) {
            setCurrentStageIdx(stageIdx);
          }
          if (msg) {
            setStageMessage(msg);
          }
        }
      );
      console.log(`[DeepGuard] Analysis finished successfully via ${usedUrl}`);
      
      setAnalysisProgress(100);
      setCurrentStageIdx(3);
      setStageMessage("Forensic dossier compiled successfully!");
      setTimeout(() => {
        onAnalysisComplete(data);
      }, 400);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to forensic backend. Please ensure the Render backend is live or localhost server is running.");
      setAnalysisProgress(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError("");
    setAnalysisProgress(0);
    setStageMessage("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const currentStage = ANALYSIS_STAGES[currentStageIdx];
  const StageIcon = currentStage?.icon || Cpu;

  return (
    <div id="detector" className={cn("w-full max-w-3xl mx-auto scroll-mt-28", className)}>
      <Card className="glass-panel border-border/80 shadow-2xl relative overflow-hidden rounded-2xl">
        {/* Subtle Accent Glow Border Top */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"></div>

        <CardContent className="p-6 sm:p-10">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Neural Forensics Dropzone
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Deepfake Media Scanner
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-lg mx-auto">
              Upload video footage to extract facial artifacts, evaluate spatial boundaries, and generate forensic Grad-CAM attention maps.
            </p>
          </div>

          {!selectedFile ? (
            /* Upload Drop Area */
            <div
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden",
                dragActive 
                  ? "border-accent bg-accent/10 shadow-glow scale-[1.01]" 
                  : "border-border/80 hover:border-accent/60 hover:bg-secondary/40 bg-secondary/20"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".mp4,.avi,.mov,.webm,.mkv,.jpg,.jpeg,.png"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center text-accent shadow-inner">
                <Upload className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </div>

              <h4 className="text-lg font-bold text-foreground mb-1">
                Drag and drop your media file here
              </h4>
              <p className="text-sm text-muted-foreground mb-5">
                or click to browse your system files
              </p>

              {/* Supported format badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto text-[11px] font-mono text-muted-foreground">
                <span className="px-2.5 py-1 rounded-md bg-secondary/80 border border-border">MP4</span>
                <span className="px-2.5 py-1 rounded-md bg-secondary/80 border border-border">MOV</span>
                <span className="px-2.5 py-1 rounded-md bg-secondary/80 border border-border">AVI</span>
                <span className="px-2.5 py-1 rounded-md bg-secondary/80 border border-border">WEBM</span>
                <span className="px-2.5 py-1 rounded-md bg-secondary/80 border border-border">JPG / PNG</span>
                <span className="text-muted-foreground/60">• Max 150MB</span>
              </div>
            </div>
          ) : (
            /* Selected File State */
            <div className="space-y-6">
              {/* File Info Card */}
              <div className="flex items-center justify-between p-4 sm:p-5 bg-secondary/50 rounded-xl border border-border/80 shadow-sm">
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center flex-shrink-0 text-accent">
                    <FileVideo className="w-6 h-6" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-semibold text-foreground text-sm sm:text-base truncate max-w-[220px] sm:max-w-md">
                      {selectedFile.name}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>{formatFileSize(selectedFile.size)}</span>
                      <span>•</span>
                      <span className="text-accent uppercase font-bold">Ready to Scan</span>
                    </div>
                  </div>
                </div>

                {!isAnalyzing && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={removeFile}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                    aria-label="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>

              {/* Stepped Progress Animation during Analysis */}
              {isAnalyzing && (
                <div className="p-5 rounded-xl bg-secondary/40 border border-accent/30 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-accent font-medium truncate max-w-[85%]">
                      <StageIcon className="w-4 h-4 animate-spin text-accent flex-shrink-0" />
                      <span className="truncate">{stageMessage || currentStage?.label}</span>
                    </span>
                    <span className="text-accent font-bold ml-2">{analysisProgress}%</span>
                  </div>

                  <Progress value={analysisProgress} className="h-2 bg-secondary" />

                  <div className="grid grid-cols-4 gap-2 pt-1 text-[10px] font-mono text-muted-foreground">
                    <div className={cn("text-center py-1 rounded transition-colors", analysisProgress >= 15 ? "text-accent bg-accent/10 font-bold" : "")}>
                      Frame Decode
                    </div>
                    <div className={cn("text-center py-1 rounded transition-colors", analysisProgress >= 30 ? "text-accent bg-accent/10 font-bold" : "")}>
                      MTCNN Crop
                    </div>
                    <div className={cn("text-center py-1 rounded transition-colors", analysisProgress >= 60 ? "text-accent bg-accent/10 font-bold" : "")}>
                      Dual-CNN
                    </div>
                    <div className={cn("text-center py-1 rounded transition-colors", analysisProgress >= 88 ? "text-accent bg-accent/10 font-bold" : "")}>
                      Grad-CAM
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button 
                size="lg" 
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow font-bold text-base py-6 rounded-xl transition-all duration-300" 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Executing Neural Forensic Pipeline...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Cpu className="w-5 h-5" />
                    Run DeepGuard AI Detection
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-5 flex items-start gap-3 text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/30 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold">Scanner Alert</div>
                <div className="text-muted-foreground text-xs leading-relaxed">{error}</div>
              </div>
            </div>
          )}

          {/* Security & Confidentiality Notice */}
          <div className="mt-8 pt-5 border-t border-border/50 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Temporary in-memory processing
            </span>
            <span>Frames pruned post-inference</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
