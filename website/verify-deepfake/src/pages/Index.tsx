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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Index = () => {
  // We only need one state now: the result from the backend
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // This function is called when FileUpload receives data from your Python API
  const handleAnalysisComplete = (data: any) => {
    setAnalysisResult(data);
  };

  // Resets the state to show the uploader again
  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <Separator className="opacity-50" />
        
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              
              {/* CONDITIONAL RENDERING */}
              {!analysisResult ? (
                // State 1: Show Upload Component
                <FileUpload onAnalysisComplete={handleAnalysisComplete} />
              ) : (
                // State 2: Show Results & Reset Button
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <AnalysisResults result={analysisResult} />
                  
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={handleReset} 
                      className="gap-2 border-primary/20 hover:bg-primary/5"
                    >
                      <RefreshCw className="w-4 h-4" /> Analyze Another File
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
        
        <Separator className="opacity-50" />
        
        <section id="how-it-works">
          <HowItWorks />
        </section>
      </main>
    </div>
  );
};

export default Index;