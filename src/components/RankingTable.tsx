
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight, Clock, Search } from 'lucide-react';

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
  const [expandedKeywords, setExpandedKeywords] = useState<Set<string>>(new Set());

  const toggleExpanded = (keywordId: string) => {
    const newExpanded = new Set(expandedKeywords);
    if (newExpanded.has(keywordId)) {
      newExpanded.delete(keywordId);
    } else {
      newExpanded.add(keywordId);
    }
    setExpandedKeywords(newExpanded);
  };

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Detailed Ranking Report</h2>
        <div className="text-sm text-gray-600">
          Client: <span className="font-medium">{businessName}</span>
        </div>
      </div>
      
      {keywords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No keywords to display for this business</p>
          <p className="text-sm">Add keywords above to start tracking rankings</p>
        </div>
      ) : (
        <div className="space-y-4">
          {keywords.map((keyword) => (
            <div key={keyword.id} className="border rounded-lg overflow-hidden">
              {/* Main Row */}
              <div className="bg-white hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(keyword.id)}
                        className="p-1"
                      >
                        {expandedKeywords.has(keyword.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                      <div>
                        <div className="font-medium">{keyword.term}</div>
                        <div className="text-xs text-gray-500">
                          {keyword.trackingHistory.length} searches recorded
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-center">
                    <Badge className={getPositionColor(keyword.currentPosition)}>
                      {keyword.currentPosition || 'Not ranked'}
                    </Badge>
                  </div>
                  
                  <div className="col-span-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(keyword.currentPosition, keyword.previousPosition)}
                      <span className="text-sm text-gray-600">
                        {getTrendText(keyword.currentPosition, keyword.previousPosition)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 text-center">
                    {getBestPosition(keyword) ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        #{getBestPosition(keyword)}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  
                  <div className="col-span-1 text-center">
                    {getAveragePosition(keyword) ? (
                      <Badge variant="outline">
                        #{getAveragePosition(keyword)}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  
                  <div className="col-span-2 text-sm text-gray-600">
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
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedKeywords.has(keyword.id) && (
                <div className="bg-gray-50 border-t p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Search History ({keyword.trackingHistory.length} records)
                  </h4>
                  
                  {keyword.trackingHistory.length === 0 ? (
                    <p className="text-gray-500 text-sm">No search history yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3">Date & Time</th>
                            <th className="text-center py-2 px-3">Position</th>
                            <th className="text-center py-2 px-3">Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {keyword.trackingHistory
                            .slice()
                            .reverse()
                            .map((entry, index) => {
                              const previousEntry = keyword.trackingHistory
                                .slice()
                                .reverse()[index + 1];
                              const change = previousEntry 
                                ? previousEntry.position - entry.position
                                : 0;
                              
                              return (
                                <tr key={index} className="border-b border-gray-100">
                                  <td className="py-2 px-3">
                                    <div>{entry.timestamp.toLocaleDateString()}</div>
                                    <div className="text-xs text-gray-500">
                                      {entry.timestamp.toLocaleTimeString()}
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 text-center">
                                    <Badge className={getPositionColor(entry.position)}>
                                      #{entry.position}
                                    </Badge>
                                  </td>
                                  <td className="py-2 px-3 text-center">
                                    {change > 0 && (
                                      <span className="text-green-600 text-xs">
                                        +{change}
                                      </span>
                                    )}
                                    {change < 0 && (
                                      <span className="text-red-600 text-xs">
                                        {change}
                                      </span>
                                    )}
                                    {change === 0 && (
                                      <span className="text-gray-400 text-xs">-</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
