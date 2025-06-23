
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Keyword {
  id: string;
  term: string;
  currentPosition: number | null;
  previousPosition: number | null;
  trackingHistory: { timestamp: Date; position: number }[];
  lastChecked: Date | null;
}

interface RankingTableProps {
  keywords: Keyword[];
  businessName: string;
}

export const RankingTable = ({ keywords, businessName }: RankingTableProps) => {
  const getTrendIcon = (current: number | null, previous: number | null) => {
    if (current === null || previous === null) return <Minus className="w-4 h-4 text-gray-400" />;
    if (current < previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current > previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getPositionColor = (position: number | null) => {
    if (position === null) return "bg-gray-100 text-gray-600";
    if (position <= 3) return "bg-green-100 text-green-800";
    if (position <= 10) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getTrendText = (current: number | null, previous: number | null) => {
    if (current === null || previous === null) return "No change";
    const diff = previous - current;
    if (diff > 0) return `+${diff} positions`;
    if (diff < 0) return `${diff} positions`;
    return "No change";
  };

  const getAveragePosition = (keyword: Keyword) => {
    if (keyword.trackingHistory.length === 0) return null;
    const sum = keyword.trackingHistory.reduce((acc, entry) => acc + entry.position, 0);
    return Math.round(sum / keyword.trackingHistory.length);
  };

  const getBestPosition = (keyword: Keyword) => {
    if (keyword.trackingHistory.length === 0) return null;
    return Math.min(...keyword.trackingHistory.map(entry => entry.position));
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Ranking Report for {businessName}</h2>
      
      {keywords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No keywords to display</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium">Keyword</th>
                <th className="text-center py-3 px-2 font-medium">Current Position</th>
                <th className="text-center py-3 px-2 font-medium">Trend</th>
                <th className="text-center py-3 px-2 font-medium">Best Position</th>
                <th className="text-center py-3 px-2 font-medium">Average Position</th>
                <th className="text-center py-3 px-2 font-medium">Checks</th>
                <th className="text-left py-3 px-2 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((keyword) => (
                <tr key={keyword.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div className="font-medium">{keyword.term}</div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Badge className={getPositionColor(keyword.currentPosition)}>
                      {keyword.currentPosition || 'Not ranked'}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(keyword.currentPosition, keyword.previousPosition)}
                      <span className="text-sm text-gray-600">
                        {getTrendText(keyword.currentPosition, keyword.previousPosition)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    {getBestPosition(keyword) ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        #{getBestPosition(keyword)}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    {getAveragePosition(keyword) ? (
                      <Badge variant="outline">
                        #{getAveragePosition(keyword)}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-gray-600">{keyword.trackingHistory.length}</span>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600">
                    {keyword.lastChecked ? (
                      <div>
                        <div>{keyword.lastChecked.toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">
                          {keyword.lastChecked.toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      'Never'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
