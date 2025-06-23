
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Globe, TrendingUp, Target } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  domain: string;
  keywords: any[];
  createdAt: Date;
}

interface BusinessSelectorProps {
  businesses: Business[];
  selectedBusinessId: string | null;
  onSelectBusiness: (businessId: string) => void;
}

export const BusinessSelector = ({ businesses, selectedBusinessId, onSelectBusiness }: BusinessSelectorProps) => {
  if (businesses.length === 0) {
    return (
      <Card className="p-4 text-center text-gray-500">
        <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No businesses to track yet</p>
        <p className="text-sm">Add a business to get started</p>
      </Card>
    );
  }

  const getBusinessStats = (business: Business) => {
    const totalKeywords = business.keywords.length;
    const rankedKeywords = business.keywords.filter(k => k.currentPosition !== null).length;
    const topRankings = business.keywords.filter(k => k.currentPosition && k.currentPosition <= 10).length;
    
    return { totalKeywords, rankedKeywords, topRankings };
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Business to Track</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.map((business) => {
          const stats = getBusinessStats(business);
          const isSelected = business.id === selectedBusinessId;
          
          return (
            <Card 
              key={business.id} 
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => onSelectBusiness(business.id)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{business.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      {business.domain}
                    </div>
                  </div>
                  {isSelected && (
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-gray-900">{stats.totalKeywords}</div>
                    <div className="text-xs text-gray-600">Keywords</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-green-600">{stats.rankedKeywords}</div>
                    <div className="text-xs text-gray-600">Ranked</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-blue-600">{stats.topRankings}</div>
                    <div className="text-xs text-gray-600">Top 10</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 text-center">
                  Added {business.createdAt.toLocaleDateString()}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
