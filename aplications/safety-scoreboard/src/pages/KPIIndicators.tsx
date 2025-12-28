import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { KPI_CONFIG } from '@/lib/constants/kpi-config';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function KPIIndicators() {
  const kpiList = Object.entries(KPI_CONFIG).map(([key, config]) => ({
    key,
    ...config
  }));

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 gradient-warm opacity-50 rounded-3xl blur-3xl"></div>
          <div className="relative bg-card rounded-2xl shadow-etsy-lg dark:shadow-none p-8 border border-orange-100 dark:border-orange-800">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              KPI Ko'rsatkichlar
            </h1>
            <p className="text-muted-foreground">
              15 ta asosiy mehnat muhofazasi ko'rsatkichlari va ularning hisoblash formulalari
            </p>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiList.map((kpi, index) => (
            <Card
              key={kpi.key}
              className="shadow-etsy dark:shadow-none border-orange-100 dark:border-orange-800 hover:shadow-etsy-lg dark:hover:shadow-none transition-all duration-300 hover-lift animate-slide-up bg-card"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{kpi.icon}</span>
                      <span className="text-foreground">{kpi.name}</span>
                    </CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">{kpi.description}</CardDescription>
                  </div>
                  <Badge
                    variant={kpi.critical ? "destructive" : "secondary"}
                    className="ml-2"
                  >
                    {kpi.critical ? "Kritik" : "Standart"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Og'irligi:</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">{(kpi.weight * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={kpi.weight * 100} className="h-2" />
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Baholash:</span>
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                      {kpi.lowerIsBetter ? "Kam yaxshi" : "Ko'p yaxshi"}
                    </Badge>
                  </div>
                </div>

                {/* Formula hint */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    {getFormulaHint(kpi.key)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <Card className="shadow-etsy dark:shadow-none border-orange-100 dark:border-orange-800 bg-card">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
            <CardTitle className="text-foreground">Baholash Mezonlari</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="font-semibold text-foreground">Yashil zona (80-100)</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  A'lo darajadagi xavfsizlik. Barcha ko'rsatkichlar me'yordan yuqori.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span className="font-semibold text-foreground">Sariq zona (50-79)</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Qoniqarli daraja. Ba'zi ko'rsatkichlarni yaxshilash talab etiladi.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="font-semibold text-foreground">Qizil zona (0-49)</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  Xavfli daraja. Zudlik bilan tuzatish choralari zarur.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function getFormulaHint(kpiKey: string): string {
  const formulas: Record<string, string> = {
    ltifr: "Penalty = (O'lim×100) + (Og'ir×50) + (Guruhli×40) + (Yengil×10)",
    hseStaffing: "Foiz = (Fakt / Normativ) × 100",
    noincident: "Foiz = (Hodisasiz kunlar / 365) × 100",
    training: "Foiz = (O'qitilganlar / Reja) × 100",
    workplaceAssessment: "Foiz = (Baholangan/Reja × 0.4) + (Bajarilgan/Reja × 0.6) × 100",
    workStoppage: "Ball = 50 + (Ichki × 2) - (Tashqi × 20)",
    insurance: "Ball = 100 - ((To'lov / Ish haqi) × 1000)",
    prevention: "Foiz = (Fakt MM xarajat / Reja MM xarajat) × 100",
    ppe: "Foiz = (Ta'minlangan / Kerak) × 100",
    equipment: "Indeks = (Tekshirilgan×0.6 + Ruxsatli×0.4) / Jami × 100",
    inspection: "Foiz = (Bajarilgan / Reja) × 100",
    occupational: "Son = Kasbiy kasalliklar soni",
    compliance: "Foiz = (1 - Auditda aniqlangan nomuvofiqliklar/Jami) × 100",
    emergency: "Foiz = (Qatnashganlar / Reja) × 100",
    violations: "Penalty = (Qizil×10) + (Sariq×3) + (Yashil×1)"
  };

  return formulas[kpiKey] || "Formula mavjud emas";
}
