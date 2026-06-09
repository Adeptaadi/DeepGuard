import { Card, CardContent } from "@/components/ui/card";
import { Upload, Brain, Shield, Zap } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Content",
      description: "Submit your image or video file through our secure interface. We support all major formats.",
      color: "text-accent"
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our deep learning model examines facial features, temporal consistency, and compression artifacts.",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Detection Engine",
      description: "Advanced algorithms identify manipulation patterns and inconsistencies invisible to the human eye.",
      color: "text-accent-glow"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Receive comprehensive analysis results with confidence scores and detailed explanations in seconds.",
      color: "text-success"
    }
  ];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How DeepShield Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our state-of-the-art AI technology combines multiple detection methods 
            to provide accurate deepfake identification with unprecedented speed and reliability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative group hover:shadow-card transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-background to-muted flex items-center justify-center border-2 border-border group-hover:border-accent transition-colors duration-300`}>
                      <Icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Why Trust DeepShield?</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">99.2%</div>
                  <div className="text-sm text-muted-foreground">Detection Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">5M+</div>
                  <div className="text-sm text-muted-foreground">Files Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Availability</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </section>
  );
};

export default HowItWorks;