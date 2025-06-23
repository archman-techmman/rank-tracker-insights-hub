
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Keyword {
  id: string;
  term: string;
  currentPosition: number | null;
  previousPosition: number | null;
  trackingHistory: { timestamp: Date; position: number }[];
  lastChecked: Date | null;
}

interface RankingChartProps {
  keywords: Keyword[];
}

export const RankingChart = ({ keywords }: RankingChartProps) => {
  // Prepare data for the chart
  const chartData = React.useMemo(() => {
    const allTimestamps = new Set<string>();
    
    // Collect all unique timestamps
    keywords.forEach(keyword => {
      keyword.trackingHistory.forEach(entry => {
        allTimestamps.add(entry.timestamp.toISOString());
      });
    });
    
    const sortedTimestamps = Array.from(allTimestamps).sort();
    
    // Create chart data points
    return sortedTimestamps.map(timestamp => {
      const dataPoint: any = {
        time: new Date(timestamp).toLocaleTimeString(),
        timestamp: timestamp,
      };
      
      keywords.forEach(keyword => {
        const entry = keyword.trackingHistory.find(
          h => h.timestamp.toISOString() === timestamp
        );
        if (entry) {
          dataPoint[keyword.term] = entry.position;
        }
      });
      
      return dataPoint;
    });
  }, [keywords]);

  const colors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea'];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Ranking Trends</h2>
      
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p>No ranking data yet</p>
            <p className="text-sm">Add keywords and check rankings to see trends</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              reversed={true}
              domain={[1, 'dataMax']}
              tick={{ fontSize: 12 }}
              label={{ value: 'Search Position', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              labelFormatter={(value) => `Time: ${value}`}
              formatter={(value: any, name: string) => [`Position ${value}`, name]}
            />
            <Legend />
            {keywords.map((keyword, index) => (
              <Line
                key={keyword.id}
                type="monotone"
                dataKey={keyword.term}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};
