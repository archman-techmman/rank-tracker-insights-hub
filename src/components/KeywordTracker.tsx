
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, TrendingDown, Minus, X } from 'lucide-react';

interface Keyword {
  id: string;
  term: string;
  currentPosition: number | null;
  previousPosition: number | null;
  trackingHistory: { timestamp: Date; position: number }[];
  lastChecked: Date | null;
}

interface KeywordTrackerProps {
  keywords: Keyword[];
  onRemoveKeyword: (id: string) => void;
  onSimulateSearch: (id: string) => void;
}

export const KeywordTracker = ({ keywords, onRemoveKeyword, onSimulateSearch }: KeywordTrackerProps) => {
  const getTrendIcon = (current: number | null, previous: number | null) => {
    if (current === null || previous === null) return null;
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

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Tracked Keywords</h2>
        <Badge variant="outline">{keywords.length} keywords</Badge>
      </div>
      
      <div className="space-y-3">
        {keywords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No keywords being tracked yet</p>
            <p className="text-sm">Add a keyword above to get started</p>
          </div>
        ) : (
          keywords.map((keyword) => (
            <div
              key={keyword.id}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">{keyword.term}</h3>
                    {getTrendIcon(keyword.currentPosition, keyword.previousPosition)}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>Position:</span>
                      <Badge className={getPositionColor(keyword.currentPosition)}>
                        {keyword.currentPosition || 'Not ranked'}
                      </Badge>
                    </div>
                    
                    {keyword.lastChecked && (
                      <span>
                        Last checked: {keyword.lastChecked.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSimulateSearch(keyword.id)}
                    className="text-xs"
                  >
                    <Search className="w-3 h-3 mr-1" />
                    Check
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveKeyword(keyword.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              {keyword.trackingHistory.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-gray-500 mb-1">Recent positions:</div>
                  <div className="flex gap-1">
                    {keyword.trackingHistory.slice(-5).map((entry, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`text-xs ${getPositionColor(entry.position)}`}
                      >
                        {entry.position}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
