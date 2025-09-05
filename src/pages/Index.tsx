import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Stethoscope, Brain, Send, AlertTriangle } from "lucide-react";
import { ModelResponse } from "@/components/ModelResponse";
import { useToast } from "@/hooks/use-toast";

interface ModelResult {
  model: string;
  response: string;
  confidence: number;
  accuracy: number;
  f1Score: number;
}

const Index = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ModelResult[] | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a medical query to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API calls to Gemini models
    try {
      // In a real implementation, you would call the actual Gemini API endpoints
      const mockResults: ModelResult[] = [
        {
          model: "gemini-2.5-flash",
          response: `Based on the symptoms you've described, this could indicate several possibilities. As a medical professional, I would recommend considering: 1) A comprehensive physical examination, 2) Relevant laboratory tests, 3) Monitoring symptom progression. The combination of symptoms suggests we should rule out both common and serious conditions. Please consult with a healthcare provider for proper evaluation and diagnosis.`,
          confidence: 0.85,
          accuracy: 0.78,
          f1Score: 0.82
        },
        {
          model: "gemini-2.5-pro",
          response: `From a clinical perspective, your query presents several diagnostic considerations. The symptom pattern warrants immediate medical attention to exclude serious conditions. I would recommend: systematic evaluation including vital signs, physical examination focusing on the affected systems, appropriate diagnostic imaging or laboratory work as indicated. Early intervention is key for optimal outcomes. This requires in-person medical assessment for accurate diagnosis.`,
          confidence: 0.92,
          accuracy: 0.88,
          f1Score: 0.90
        },
        {
          model: "gemini-1.5-flash",
          response: `Your medical concern requires professional evaluation. While I can provide general medical guidance, the symptoms you describe need proper clinical assessment. Consider scheduling an appointment with your primary care physician or seeking urgent care if symptoms are severe. A thorough history, physical examination, and potentially some diagnostic tests would help determine the underlying cause and appropriate treatment plan.`,
          confidence: 0.76,
          accuracy: 0.82,
          f1Score: 0.79
        },
        {
          model: "gemini-1.5-pro",
          response: `As a physician, I would approach this case systematically. The presentation suggests multiple differential diagnoses that require careful consideration. Initial workup should include: detailed medical history, comprehensive physical examination, baseline laboratory studies, and imaging as clinically indicated. The key is to maintain a broad differential while prioritizing life-threatening conditions. Referral to a specialist may be warranted depending on findings.`,
          confidence: 0.89,
          accuracy: 0.85,
          f1Score: 0.87
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setResults(mockResults);
      
      toast({
        title: "Analysis Complete",
        description: "Successfully analyzed responses from all 4 models.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze the medical query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResults(null);
    setQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <Stethoscope className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              <h1 className="text-3xl font-bold">Medical AI Orchestrator</h1>
            </div>
          </div>
          <p className="text-primary-foreground/90 text-lg max-w-3xl">
            Compare responses from 4 advanced Gemini models acting as qualified medical doctors. 
            Get comprehensive analysis with confidence, accuracy, and F1 scores.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!results ? (
          /* Query Input Form */
          <Card className="max-w-4xl mx-auto p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="query" className="text-lg font-semibold">
                  Medical Query
                </Label>
                <Textarea
                  id="query"
                  placeholder="Enter your medical query, symptoms, test results, or health concerns..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-32 resize-none"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing with 4 AI Models...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Analyze Medical Query
                  </>
                )}
              </Button>
            </form>
          </Card>
        ) : (
          /* Results Display */
          <div className="space-y-6">
            {/* Header with Reset Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Model Comparison Results</h2>
              <Button variant="outline" onClick={resetAnalysis}>
                New Analysis
              </Button>
            </div>

            {/* Original Query */}
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Original Query:</h3>
              <p className="text-muted-foreground">{query}</p>
            </Card>

            {/* Model Responses */}
            <div className="grid gap-6">
              {results.map((result, index) => (
                <ModelResponse key={index} result={result} />
              ))}
            </div>
          </div>
        )}

        {/* Medical Disclaimer */}
        <Card className="mt-8 p-6 border-warning bg-warning/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-warning mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-warning mb-2">Medical Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                This is AI-generated medical advice for informational purposes only. 
                The responses provided are educational and should not be considered as 
                professional medical diagnosis or treatment recommendations. Always consult 
                with a licensed physician or healthcare provider for professional medical care, 
                accurate diagnosis, and appropriate treatment decisions.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;