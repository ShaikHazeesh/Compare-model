import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Target, Zap, Copy, Check } from "lucide-react";
import { ModelResult, MODEL_DISPLAY_NAMES } from "@/lib/geminiService";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ModelResponseProps {
  result: ModelResult;
}

export const ModelResponse = ({ result }: ModelResponseProps) => {
  const { toast } = useToast();
  const [copiedSections, setCopiedSections] = useState<Set<string>>(new Set());
  const [copiedFull, setCopiedFull] = useState(false);

  const formatPercentage = (score: number) => {
    const percentage = Math.round(score * 100);
    return Math.min(percentage, 100); // Cap at 100%
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 0.8) return "text-success";
    if (score >= 0.6) return "text-warning";
    return "text-destructive";
  };

  const getBadgeVariant = (score: number) => {
    if (score >= 0.8) return "default";
    if (score >= 0.6) return "secondary";
    return "destructive";
  };

  const getModelBadgeColor = (model: string) => {
    if (model.includes("2.5-pro")) return "default";
    if (model.includes("2.5-flash")) return "secondary";
    if (model.includes("2.5-flash-lite")) return "outline";
    if (model.includes("2.0-flash")) return "outline";
    return "outline";
  };

  const getModelBadgeText = (model: string) => {
    if (model.includes("2.5-pro")) return "Most Powerful";
    if (model.includes("2.5-flash")) return "Hybrid Reasoning";
    if (model.includes("2.5-flash-lite")) return "Cost Effective";
    if (model.includes("2.0-flash")) return "Balanced Multimodal";
    return "Advanced Model";
  };

  const copyToClipboard = async (text: string, sectionId?: string) => {
    try {
      // Clean the text by removing ** and * markdown
      const cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1');
      await navigator.clipboard.writeText(cleanText);
      if (sectionId) {
        setCopiedSections(prev => new Set([...prev, sectionId]));
        setTimeout(() => {
          setCopiedSections(prev => {
            const newSet = new Set(prev);
            newSet.delete(sectionId);
            return newSet;
          });
        }, 2000);
      } else {
        setCopiedFull(true);
        setTimeout(() => setCopiedFull(false), 2000);
      }
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard",
        variant: "destructive",
      });
    }
  };

  const parseResponseSections = (response: string) => {
    const sections: { title: string; content: string; id: string }[] = [];
    const lines = response.split('\n');
    let currentSection = { title: '', content: '', id: '' };
    
    for (const line of lines) {
      // Check if line is a section header - remove ** and make it clean
      if (line.match(/^\*\*[A-Z][^*]+:\*\*$/) || line.match(/^\*\*[A-Z\s]+:\*\*$/)) {
        // Save previous section if it has content
        if (currentSection.title && currentSection.content.trim()) {
          sections.push({ ...currentSection });
        }
        // Start new section - remove ** and :
        const title = line.replace(/\*\*/g, '').replace(':', '');
        currentSection = {
          title,
          content: '',
          id: title.toLowerCase().replace(/\s+/g, '-')
        };
      } else if (currentSection.title) {
        // Add content to current section
        currentSection.content += line + '\n';
      } else {
        // Content before first section (introduction)
        if (line.trim()) {
          if (!sections.find(s => s.id === 'introduction')) {
            sections.unshift({
              title: 'Introduction',
              content: line + '\n',
              id: 'introduction'
            });
          } else {
            sections[0].content += line + '\n';
          }
        }
      }
    }
    
    // Add the last section
    if (currentSection.title && currentSection.content.trim()) {
      sections.push(currentSection);
    }
    
    return sections;
  };

  const formatSectionContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Handle medication dosages and schedules
      if (line.match(/^\d+\s*(mg|ml|g|tablet|capsule|dose)/i) || line.match(/^\d+:\d+\s*(AM|PM|am|pm)/i)) {
        return (
          <div key={index} className="ml-6 mb-3 flex items-start bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <span className="text-medical-blue dark:text-blue-400 mr-3 mt-1 font-bold text-lg">💊</span>
            <span className="text-sm leading-relaxed font-medium text-gray-800 dark:text-gray-200">{line}</span>
          </div>
        );
      }
      // Handle bullet points
      if (line.startsWith('- ')) {
        const cleanedLine = line.substring(2)
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<strong>$1</strong>'); // Handle single asterisks too
        return (
          <div key={index} className="ml-6 mb-2 flex items-start">
            <span className="text-medical-blue dark:text-blue-400 mr-3 mt-1 font-bold">•</span>
            <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: cleanedLine }} />
          </div>
        );
      }
      // Handle numbered lists
      if (line.match(/^\d+\.\s/)) {
        const cleanedLine = line.replace(/^\d+\.\s/, '')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<strong>$1</strong>'); // Handle single asterisks too
        return (
          <div key={index} className="ml-6 mb-2 flex items-start">
            <span className="text-medical-blue dark:text-blue-400 mr-3 mt-1 font-semibold bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full text-xs">
              {line.match(/^\d+\./)?.[0]}
            </span>
            <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: cleanedLine }} />
          </div>
        );
      }
      // Handle subheaders - remove stars and make bold
      if (line.match(/^\*\*.*\*\*:/)) {
        const cleanedHeader = line.replace(/\*\*/g, '');
        return (
          <div key={index} className="font-bold text-gray-800 dark:text-gray-100 mt-3 mb-2 text-base">
            {cleanedHeader}
          </div>
        );
      }
      // Handle warning/urgent text
      if (line.match(/urgent|emergency|immediately|critical|warning/i)) {
        const cleanedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return (
          <div key={index} className="mb-3 text-sm leading-relaxed text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
            <span className="mr-2">⚠️</span>
            <span dangerouslySetInnerHTML={{ __html: cleanedLine }} />
          </div>
        );
      }
      // Handle regular paragraphs - remove ** and * and make content bold
      if (line.trim()) {
        const cleanedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<strong>$1</strong>'); // Handle single asterisks too
        return (
          <div key={index} className="mb-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <span dangerouslySetInnerHTML={{ __html: cleanedLine }} />
          </div>
        );
      }
      return <div key={index} className="h-2" />;
    });
  };

  const sections = parseResponseSections(result.response);
  const cleanResponse = result.response
    .replace(/\*\*(RESPONSE METRICS:|Confidence Score:|Accuracy Score:|F1 Score:)\*\*[\s\S]*$/i, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .trim();

  const generateSummary = () => {
    const intro = sections.find(s => s.id === 'introduction');
    const assessment = sections.find(s => s.id === 'clinical-assessment');
    
    if (intro && intro.content.trim()) {
      return intro.content.trim().substring(0, 200) + (intro.content.length > 200 ? '...' : '');
    } else if (assessment && assessment.content.trim()) {
      return assessment.content.trim().substring(0, 200) + (assessment.content.length > 200 ? '...' : '');
    }
    return 'Comprehensive medical analysis provided.';
  };

  return (
    <Card className="p-6 space-y-6 bg-card dark:bg-slate-900/50 border-border dark:border-slate-700 shadow-lg dark:shadow-xl">
      {/* Model Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 dark:bg-blue-900/30 rounded-lg">
            <Brain className="h-5 w-5 text-primary dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground dark:text-white">
              {MODEL_DISPLAY_NAMES[result.model as keyof typeof MODEL_DISPLAY_NAMES] || result.model}
            </h3>
            <Badge variant={getModelBadgeColor(result.model)} className="mt-1">
              {getModelBadgeText(result.model)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-medical-blue dark:text-blue-400 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-medical-blue rounded-full"></span>
          Quick Summary
        </h4>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
          {generateSummary()}
        </p>
      </div>

      {/* Doctor Response */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-medical-blue dark:text-blue-400 text-lg">
            Doctor Response
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(cleanResponse)}
            className="flex items-center gap-2 border-medical-blue dark:border-blue-400 text-medical-blue dark:text-blue-400 hover:bg-medical-blue hover:text-white dark:hover:bg-blue-600 transition-colors"
          >
            {copiedFull ? (
              <><Check className="h-4 w-4 text-green-600" /> Copied Complete Response!</>
            ) : (
              <><Copy className="h-4 w-4" /> Copy Complete Response</>
            )}
          </Button>
        </div>
        
        <div className="bg-muted/50 dark:bg-slate-800/50 p-6 rounded-lg border border-border dark:border-slate-700 shadow-sm">
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-medical-blue dark:text-blue-400 text-base border-b-2 border-medical-blue dark:border-blue-400 pb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-medical-blue dark:bg-blue-400 rounded-full"></span>
                    {section.title}
                  </h5>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const cleanSectionContent = section.content
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/\*(.*?)\*/g, '$1');
                      copyToClipboard(`${section.title}:\n\n${cleanSectionContent.trim()}`, section.id);
                    }}
                    className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {copiedSections.has(section.id) ? (
                      <><Check className="h-3 w-3 text-green-600" /> Copied</>
                    ) : (
                      <><Copy className="h-3 w-3" /> Copy Section</>
                    )}
                  </Button>
                </div>
                
                <div className="pl-4 border-l-2 border-medical-blue/20 dark:border-blue-400/20 medical-content">
                  {formatSectionContent(section.content)}
                </div>
                
                {sectionIndex < sections.length - 1 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scoring Metrics */}
      <div className="space-y-4">
        <div className="text-center">
          <h5 className="text-sm font-medium text-muted-foreground dark:text-gray-400">
            AI-Provided Response Metrics
          </h5>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-medical-blue dark:text-blue-400" />
              <span className="font-medium text-foreground dark:text-white">Confidence</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground dark:text-gray-400">Score</span>
                <span className={`text-sm font-medium ${getScoreTextColor(result.confidence)}`}>
                  {formatPercentage(result.confidence)}%
                </span>
              </div>
              <Progress 
                value={formatPercentage(result.confidence)} 
                className="h-2"
              />
            </div>
          </div>

        {/* Accuracy Score */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-medical-green dark:text-green-400" />
            <span className="font-medium text-foreground dark:text-white">Accuracy</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground dark:text-gray-400">Score</span>
              <span className={`text-sm font-medium ${getScoreTextColor(result.accuracy)}`}>
                {formatPercentage(result.accuracy)}%
              </span>
            </div>
            <Progress 
              value={formatPercentage(result.accuracy)} 
              className="h-2"
            />
          </div>
        </div>

        {/* F1 Score */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-medical-gray dark:text-gray-400" />
            <span className="font-medium text-foreground dark:text-white">F1 Score</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground dark:text-gray-400">Score</span>
              <span className={`text-sm font-medium ${getScoreTextColor(result.f1Score)}`}>
                {formatPercentage(result.f1Score)}%
              </span>
            </div>
            <Progress 
              value={formatPercentage(result.f1Score)} 
              className="h-2"
            />
          </div>
        </div>
        </div>
      </div>

      {/* Overall Performance Summary */}
      <div className="bg-primary/5 dark:bg-blue-900/20 p-4 rounded-lg border border-primary/20 dark:border-blue-800/30">
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground dark:text-white">Overall Performance</span>
          <Badge variant={getBadgeVariant((result.confidence + result.accuracy + result.f1Score) / 3)}>
            {formatPercentage((result.confidence + result.accuracy + result.f1Score) / 3)}% Average
          </Badge>
        </div>
      </div>
    </Card>
  );
};