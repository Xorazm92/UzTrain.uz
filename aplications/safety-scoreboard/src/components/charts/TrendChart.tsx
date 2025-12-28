import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MONTHLY_TREND_DATA } from '@/lib/kpiData';

export function TrendChart() {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={MONTHLY_TREND_DATA}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(152 69% 42%)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="hsl(152 69% 42%)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(38 95% 50%)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="hsl(38 95% 50%)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0 84% 55%)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="hsl(0 84% 55%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Area 
            type="monotone" 
            dataKey="greenZone" 
            name="Yashil zona"
            stroke="hsl(152 69% 42%)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorGreen)" 
          />
          <Area 
            type="monotone" 
            dataKey="yellowZone" 
            name="Sariq zona"
            stroke="hsl(38 95% 50%)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorYellow)" 
          />
          <Area 
            type="monotone" 
            dataKey="redZone" 
            name="Qizil zona"
            stroke="hsl(0 84% 55%)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorRed)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
