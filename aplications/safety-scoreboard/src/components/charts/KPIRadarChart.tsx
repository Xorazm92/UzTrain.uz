import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { KPI_COMPARISON_DATA } from '@/lib/kpiData';

export function KPIRadarChart() {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={KPI_COMPARISON_DATA}>
          <PolarGrid 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.5}
          />
          <PolarAngleAxis 
            dataKey="indicator" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          <Radar
            name="Hozirgi"
            dataKey="current"
            stroke="hsl(25 95% 53%)"
            fill="hsl(25 95% 53%)"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Maqsad"
            dataKey="target"
            stroke="hsl(152 69% 42%)"
            fill="hsl(152 69% 42%)"
            fillOpacity={0.15}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
            formatter={(value: number) => [`${value}%`]}
          />
          <Legend 
            formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
