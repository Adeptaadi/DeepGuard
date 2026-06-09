import { Button } from "@/components/ui/button";
import { Upload, Shield, Zap } from "lucide-react";
import heroShield from "@/assets/hero-shield.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6 border border-accent/20">
              <Shield className="w-4 h-4" />
              AI-Powered Detection
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-accent mb-6 leading-tight">
              Detect the Truth in Seconds
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Upload a photo or video, and let our AI model analyze it for signs
              of manipulation. Powered by deep learning and advanced computer
              vision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="group">
                <Upload className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Detection
              </Button>
              <Button variant="glow" size="lg">
                <Zap className="w-5 h-5 mr-2" />
                How It Works
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">99.2%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{"<"}5s</div>
                <div className="text-sm text-muted-foreground">
                  Analysis Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">24/7</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-accent opacity-20 blur-3xl rounded-full"></div>
            <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-card">
              <img
                src={heroShield}
                alt="AI-powered deepfake detection visualization"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute top right-4 bg-success text-primary px-3 py-1 rounded-full text-sm font-medium border border-success/30">
                ✓ Real
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 right-32 w-1 h-1 bg-accent-glow rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-20 w-1.5 h-1.5 bg-accent rounded-full animate-pulse delay-500"></div>
    </section>
  );
};

export default Hero;
