
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, TrendingUp, TrendingDown, Plus, Play, Pause } from 'lucide-react';
import { KeywordTracker } from '@/components/KeywordTracker';
import { RankingChart } from '@/components/RankingChart';
import { RankingTable } from '@/components/RankingTable';
import { StatsCards } from '@/components/StatsCards';

interface Keyword {
  id: string;
  term: string;
  currentPosition: number | null;
  previousPosition: number | null;
  trackingHistory: { timestamp: Date; position: number }[];
  lastChecked: Date | null;
}

const Index = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [businessName, setBusinessName] = useState('Your Business');
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockKeywords: Keyword[] = [
      {
        id: '1',
        term: 'best coffee shop',
        currentPosition: 3,
        previousPosition: 5,
        trackingHistory: [
          { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), position: 5 },
          { timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), position: 4 },
          { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), position: 3 },
          { timestamp: new Date(), position: 3 },
        ],
        lastChecked: new Date(),
      },
      {
        id: '2',
        term: 'local cafe near me',
        currentPosition: 7,
        previousPosition: 8,
        trackingHistory: [
          { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), position: 8 },
          { timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), position: 7 },
          { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), position: 7 },
          { timestamp: new Date(), position: 7 },
        ],
        lastChecked: new Date(),
      },
    ];
    setKeywords(mockKeywords);
  }, []);

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    
    const keyword: Keyword = {
      id: Date.now().toString(),
      term: newKeyword.trim(),
      currentPosition: null,
      previousPosition: null,
      trackingHistory: [],
      lastChecked: null,
    };
    
    setKeywords([...keywords, keyword]);
    setNewKeyword('');
    toast({
      title: "Keyword Added",
      description: `Now tracking "${newKeyword.trim()}"`,
    });
  };

  const removeKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
    toast({
      title: "Keyword Removed",
      description: "Keyword removed from tracking",
    });
  };

  const simulateSearch = (keywordId: string) => {
    const newPosition = Math.floor(Math.random() * 20) + 1;
    setKeywords(keywords.map(k => {
      if (k.id === keywordId) {
        return {
          ...k,
          previousPosition: k.currentPosition,
          currentPosition: newPosition,
          trackingHistory: [
            ...k.trackingHistory,
            { timestamp: new Date(), position: newPosition }
          ],
          lastChecked: new Date(),
        };
      }
      return k;
    }));
    
    toast({
      title: "Search Simulated",
      description: `Found at position ${newPosition}`,
    });
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    toast({
      title: isTracking ? "Tracking Paused" : "Tracking Started",
      description: isTracking ? "Automatic tracking paused" : "Now tracking rankings automatically",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">SEO Ranking Tracker</h1>
            <p className="text-gray-600">Monitor your business rankings for key search terms</p>
          </div>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Your Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-48"
            />
            <Button
              onClick={toggleTracking}
              variant={isTracking ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isTracking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTracking ? "Pause" : "Start"} Tracking
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards keywords={keywords} />

        {/* Add Keyword */}
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter keyword to track (e.g., 'best pizza near me')"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  className="flex-1"
                />
                <Button onClick={addKeyword} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Keyword
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Keyword List */}
          <div className="lg:col-span-1">
            <KeywordTracker
              keywords={keywords}
              onRemoveKeyword={removeKeyword}
              onSimulateSearch={simulateSearch}
            />
          </div>

          {/* Charts and Data */}
          <div className="lg:col-span-2 space-y-6">
            <RankingChart keywords={keywords} />
            <RankingTable keywords={keywords} businessName={businessName} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
