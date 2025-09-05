import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Target, Zap } from "lucide-react";

interface ModelResult {
  model: string;
  response: string;
  confidence: number;
  accuracy: number;
  f1Score: number;
}

interface ModelResponseProps {
  result: ModelResult;
}

export const ModelResponse = ({ result }: ModelResponseProps) => {
  const formatPercentage = (score: number) => Math.round(score * 100);

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
    if (model.includes("2.5")) return "default";
    return "secondary";
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Model Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{result.model}</h3>
            <Badge variant={getModelBadgeColor(result.model)}>
              {result.model.includes("2.5") ? "Latest Generation" : "Previous Generation"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Doctor Response */}
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <span className="text-medical-blue">Doctor Response</span>
        </h4>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm leading-relaxed">{result.response}</p>
        </div>
      </div>

      {/* Scoring Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-medical-blue" />
            <span className="font-medium">Confidence</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Score</span>
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
            <Target className="h-4 w-4 text-medical-green" />
            <span className="font-medium">Accuracy</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Score</span>
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
            <TrendingUp className="h-4 w-4 text-medical-gray" />
            <span className="font-medium">F1 Score</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Score</span>
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

      {/* Overall Performance Summary */}
      <div className="bg-primary/5 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium">Overall Performance</span>
          <Badge variant={getBadgeVariant((result.confidence + result.accuracy + result.f1Score) / 3)}>
            {formatPercentage((result.confidence + result.accuracy + result.f1Score) / 3)}% Average
          </Badge>
        </div>
      </div>
    </Card>
  );
};