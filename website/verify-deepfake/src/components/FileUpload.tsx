// import { useState, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Upload, FileImage, FileVideo, X, AlertCircle } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface FileUploadProps {
//   onFileSelect: (file: File) => void;
//   className?: string;
// }

// const FileUpload = ({ onFileSelect, className }: FileUploadProps) => {
//   const [dragActive, setDragActive] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [error, setError] = useState<string>("");

//   const handleDrag = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   }, []);

//   const validateFile = (file: File): boolean => {
//     const maxSize = 50 * 1024 * 1024; // 50MB
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/mov'];
    
//     if (file.size > maxSize) {
//       setError("File size must be less than 50MB");
//       return false;
//     }
    
//     if (!allowedTypes.includes(file.type)) {
//       setError("Please upload an image (JPEG, PNG, WebP) or video (MP4, WebM, MOV) file");
//       return false;
//     }
    
//     setError("");
//     return true;
//   };

//   const handleDrop = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       if (validateFile(file)) {
//         setSelectedFile(file);
//         onFileSelect(file);
//       }
//     }
//   }, [onFileSelect]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (validateFile(file)) {
//         setSelectedFile(file);
//         onFileSelect(file);
//       }
//     }
//   };

//   const removeFile = () => {
//     setSelectedFile(null);
//     setError("");
//   };

//   const isImage = selectedFile?.type.startsWith('image/');
//   const isVideo = selectedFile?.type.startsWith('video/');

//   return (
//     <Card className={cn("w-full max-w-2xl mx-auto", className)}>
//       <CardContent className="p-8">
//         <div className="text-center mb-6">
//           <h3 className="text-2xl font-bold mb-2">Upload Media for Analysis</h3>
//           <p className="text-muted-foreground">
//             Upload an image or video file to detect potential deepfake manipulation
//           </p>
//         </div>

//         {!selectedFile ? (
//           <div
//             className={cn(
//               "relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300",
//               dragActive 
//                 ? "border-accent bg-accent/5 shadow-glow" 
//                 : "border-border hover:border-accent/50 hover:bg-accent/5"
//             )}
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//           >
//             <input
//               type="file"
//               accept="image/*,video/*"
//               onChange={handleChange}
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//             />
            
//             <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
//             <h4 className="text-lg font-semibold mb-2">Drag & drop your file here</h4>
//             <p className="text-muted-foreground mb-4">or click to browse</p>
//             <Button variant="outline">Choose File</Button>
            
//             <div className="mt-6 text-xs text-muted-foreground">
//               Supports: JPEG, PNG, WebP, MP4, WebM, MOV • Max size: 50MB
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
//               <div className="flex items-center gap-3">
//                 {isImage && <FileImage className="w-8 h-8 text-accent" />}
//                 {isVideo && <FileVideo className="w-8 h-8 text-accent" />}
//                 <div>
//                   <div className="font-medium">{selectedFile.name}</div>
//                   <div className="text-sm text-muted-foreground">
//                     {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                   </div>
//                 </div>
//               </div>
//               <Button variant="ghost" size="icon" onClick={removeFile}>
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
            
//             <Button variant="hero" size="lg" className="w-full">
//               Analyze for Deepfakes
//             </Button>
//           </div>
//         )}

//         {error && (
//           <div className="mt-4 flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
//             <AlertCircle className="w-4 h-4" />
//             <span className="text-sm">{error}</span>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default FileUpload;

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileImage, FileVideo, X, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onAnalysisComplete: (data: any) => void;
  className?: string;
}

const FileUpload = ({ onAnalysisComplete, className }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm', 'video/quicktime'];
    
    if (file.size > maxSize) {
      setError("File size must be less than 50MB");
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload an image (JPEG, PNG) or video (MP4, WebM, MOV)");
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

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Connect to Python Backend
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed. Is the backend running?");

      const data = await response.json();
      onAnalysisComplete(data); // Pass result to parent
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server. Ensure 'uvicorn' is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError("");
  };

  return (
    <Card className={cn("w-full max-w-2xl mx-auto shadow-card", className)}>
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Upload Media for Analysis</h3>
          <p className="text-muted-foreground">
            Supported formats: MP4, AVI, MOV, JPG, PNG
          </p>
        </div>

        {!selectedFile ? (
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300",
              dragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-lg font-semibold mb-2">Drag & drop your file here</h4>
            <Button variant="outline">Choose File</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-3">
                <FileVideo className="w-8 h-8 text-accent" />
                <div>
                  <div className="font-medium">{selectedFile.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile} disabled={isAnalyzing}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              size="lg" 
              className="w-full" 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                "Run Deepfake Analysis"
              )}
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;