import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Stethoscope, Brain, Send, AlertTriangle } from "lucide-react";
import { ModelResponse } from "@/components/ModelResponse";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { getGeminiResponses, ModelResult } from "@/lib/geminiService";

// ModelResult interface is now imported from geminiService

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
    
    try {
      // Call the real Gemini API with all four models
      const results = await getGeminiResponses(query);
      setResults(results);
      
      toast({
        title: "Analysis Complete",
        description: "Successfully analyzed responses from all 4 Gemini models.",
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the medical query. Please check your API key and try again.",
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
          {/* Theme Toggle - Fixed Position */}
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          
          {/* Main Content - Centered */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Stethoscope className="h-8 w-8" />
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6" />
                <h1 className="text-3xl font-bold">Medical AI Orchestrator</h1>
              </div>
            </div>
            <p className="text-primary-foreground/90 text-lg max-w-4xl mx-auto">
              Compare responses from 4 advanced Gemini models (including the latest 2.5 Pro, 2.5 Flash, and 2.0 Flash) acting as qualified medical doctors. 
              Get comprehensive analysis with confidence, accuracy, and F1 scores in a structured, easy-to-read format.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!results ? (
          /* Query Input Form */
          <Card className="max-w-4xl mx-auto p-8 bg-card dark:bg-slate-900/50 border-border dark:border-slate-700 shadow-lg dark:shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="query" className="text-lg font-semibold text-foreground dark:text-white">
                  Medical Query
                </Label>
                <Textarea
                  id="query"
                  placeholder="Enter your medical query, symptoms, test results, or health concerns..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-32 resize-none bg-background dark:bg-slate-800 border-border dark:border-slate-600 text-foreground dark:text-white"
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 dark:bg-blue-600 dark:hover:bg-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing with 4 Gemini Models (2.5 Pro, 2.5 Flash, 2.0 Flash)...
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
              <h2 className="text-2xl font-bold text-foreground dark:text-white">Model Comparison Results</h2>
              <Button variant="outline" onClick={resetAnalysis} className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-800">
                New Analysis
              </Button>
            </div>

            {/* Original Query */}
            <Card className="p-6 bg-card dark:bg-slate-900/50 border-border dark:border-slate-700 shadow-sm">
              <h3 className="font-semibold mb-2 text-foreground dark:text-white">Original Query:</h3>
              <p className="text-muted-foreground dark:text-gray-300">{query}</p>
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
        <Card className="mt-8 p-6 border-warning bg-warning/5 dark:bg-yellow-900/20 border-warning dark:border-yellow-800/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-warning dark:text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-warning dark:text-yellow-400 mb-2">Medical Disclaimer</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-300">
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