import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Company } from '@/lib/kpiData';

interface ScoreBarChartProps {
  companies: Company[];
}

export function ScoreBarChart({ companies }: ScoreBarChartProps) {
  const data = companies.slice(0, 10).map(company => ({
    name: company.shortName || company.name.slice(0, 15),
    score: company.totalScore,
    zone: company.zone,
  }));

  const getBarColor = (zone: string) => {
    switch (zone) {
      case 'green': return 'hsl(152 69% 42%)';
      case 'yellow': return 'hsl(38 95% 50%)';
      case 'red': return 'hsl(0 84% 55%)';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} horizontal={false} />
          <XAxis 
            type="number" 
            domain={[0, 100]}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            type="category" 
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Ball']}
            labelFormatter={(label) => `${label}`}
          />
          <ReferenceLine x={80} stroke="hsl(152 69% 42%)" strokeDasharray="5 5" strokeWidth={2} />
          <ReferenceLine x={50} stroke="hsl(38 95% 50%)" strokeDasharray="5 5" strokeWidth={2} />
          <Bar 
            dataKey="score" 
            radius={[0, 6, 6, 0]}
            barSize={20}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.zone)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
