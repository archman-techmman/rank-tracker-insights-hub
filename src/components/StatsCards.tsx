
import { Card } from '@/components/ui/card';
import { TrendingUp, Search, Target, BarChart3 } from 'lucide-react';

interface Keyword {
  id: string;
  term: string;
  currentPosition: number | null;
  previousPosition: number | null;
  trackingHistory: { timestamp: Date; position: number }[];
  lastChecked: Date | null;
}

interface StatsCardsProps {
  keywords: Keyword[];
}

export const StatsCards = ({ keywords }: StatsCardsProps) => {
  const totalKeywords = keywords.length;
  const rankedKeywords = keywords.filter(k => k.currentPosition !== null).length;
  const topTenRankings = keywords.filter(k => k.currentPosition && k.currentPosition <= 10).length;
  
  const improvingKeywords = keywords.filter(k => {
    return k.currentPosition && k.previousPosition && k.currentPosition < k.previousPosition;
  }).length;

  const averagePosition = keywords.length > 0 
    ? Math.round(
        keywords
          .filter(k => k.currentPosition)
          .reduce((sum, k) => sum + (k.currentPosition || 0), 0) / 
        keywords.filter(k => k.currentPosition).length
      ) || 0
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Keywords</p>
            <p className="text-2xl font-bold text-gray-900">{totalKeywords}</p>
          </div>
          <Search className="w-8 h-8 text-blue-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Currently Ranked</p>
            <p className="text-2xl font-bold text-gray-900">{rankedKeywords}</p>
            <p className="text-xs text-gray-500">
              {totalKeywords > 0 ? Math.round((rankedKeywords / totalKeywords) * 100) : 0}% of keywords
            </p>
          </div>
          <Target className="w-8 h-8 text-green-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Top 10 Rankings</p>
            <p className="text-2xl font-bold text-gray-900">{topTenRankings}</p>
            <p className="text-xs text-gray-500">First page results</p>
          </div>
          <BarChart3 className="w-8 h-8 text-purple-500" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Improving Rankings</p>
            <p className="text-2xl font-bold text-gray-900">{improvingKeywords}</p>
            <p className="text-xs text-gray-500">Moving up in results</p>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-500" />
        </div>
      </Card>
    </div>
  );
};
