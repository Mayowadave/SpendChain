import React from 'react';
import { 
  Sparkles, 
  PieChart as PieChartIcon, 
  Calendar, 
  FileCode2, 
  Layers, 
  Flame, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Bot,
  ArrowRight
} from 'lucide-react';
import { AiInsightCard } from '../services/analyticsEngine';
import { Card, Badge, Button } from './ui';

interface AiInsightCardsSectionProps {
  insights: AiInsightCard[];
  onTriggerAi?: (prompt: string) => void;
  title?: string;
  subtitle?: string;
}

export const AiInsightCardsSection: React.FC<AiInsightCardsSectionProps> = ({
  insights,
  onTriggerAi,
  title = "AI On-Chain Observations & Insights",
  subtitle = "Dynamic observations calculated from your real-time wallet analytics object"
}) => {
  const getIcon = (iconName: AiInsightCard['icon']) => {
    switch (iconName) {
      case 'PieChart':
        return <PieChartIcon className="w-4 h-4 text-purple-400" />;
      case 'Calendar':
        return <Calendar className="w-4 h-4 text-teal-400" />;
      case 'FileCode2':
        return <FileCode2 className="w-4 h-4 text-indigo-400" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-blue-400" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'DollarSign':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'Clock':
        return <Clock className="w-4 h-4 text-rose-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <span>{title}</span>
              <Badge variant="teal" size="sm">{insights.length} Insights Generated</Badge>
            </h2>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        </div>

        {onTriggerAi && (
          <button
            onClick={() => onTriggerAi('Summarize my top AI insights and suggest strategic actions for my Stacks wallet.')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 transition-colors self-start sm:self-auto"
          >
            <span>Ask AI Copilot for Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid of Structured Insight Cards (Between 5 and 10 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((card) => (
          <Card 
            key={card.id} 
            variant="panel" 
            className={`p-4 space-y-3 border-l-4 transition-all hover:border-white/20 hover:scale-[1.01] ${card.accentColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-md bg-slate-900 border border-white/5">
                  {getIcon(card.icon)}
                </div>
                <span className="text-xs font-bold text-gray-200 truncate max-w-[120px] sm:max-w-[140px]">
                  {card.title}
                </span>
              </div>
              {card.badgeText && (
                <Badge variant="purple" size="sm">{card.badgeText}</Badge>
              )}
            </div>

            <div className="text-sm font-semibold text-white leading-snug">
              "{card.observation}"
            </div>

            {card.highlightValue && (
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>Key Metric:</span>
                <span className="text-amber-300 font-bold">{card.highlightValue}</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
