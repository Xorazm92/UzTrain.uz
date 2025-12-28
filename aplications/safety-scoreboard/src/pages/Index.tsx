import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { CompanyRankingCard } from "@/components/CompanyRankingCard";
import { ZoneBadge } from "@/components/ZoneBadge";
import { MOCK_COMPANIES, getDashboardStats } from "@/lib/kpiData";
import { ZoneDistributionChart } from "@/components/charts/ZoneDistributionChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { KPIRadarChart } from "@/components/charts/KPIRadarChart";
import { ScoreBarChart } from "@/components/charts/ScoreBarChart";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  HardHat,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Train
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const stats = getDashboardStats(MOCK_COMPANIES);
  const topCompanies = MOCK_COMPANIES.slice(0, 5);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container py-12 md:py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
              <HardHat className="h-4 w-4" />
              O'zbekiston temir yo'llari AJ
              <Train className="h-4 w-4" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Mehnat Muhofazasi{" "}
              <span className="text-gradient">KPI Reytingi</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Korxonalar xavfsizlik ko'rsatkichlarini real vaqtda monitoring qilish, 
              tahlil qilish va reyting tizimi orqali baholash platformasi
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="gradient" size="lg" onClick={() => navigate("/companies")}>
                Korxonalarni ko'rish
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/admin")}>
                Korxona qo'shish
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Jami korxonalar"
            value={stats.totalCompanies}
            subtitle="Ro'yxatdagi"
            icon={Building2}
            variant="primary"
            delay={0}
          />
          <StatCard
            title="Yashil zona"
            value={stats.greenZone}
            subtitle="80+ ball"
            icon={CheckCircle2}
            variant="green"
            delay={100}
          />
          <StatCard
            title="Sariq zona"
            value={stats.yellowZone}
            subtitle="50-79 ball"
            icon={AlertTriangle}
            variant="yellow"
            delay={200}
          />
          <StatCard
            title="Qizil zona"
            value={stats.redZone}
            subtitle="50 dan kam"
            icon={XCircle}
            variant="red"
            delay={300}
          />
        </div>
      </section>

      {/* Charts Section */}
      <section className="container pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-card hover-lift">
            <h3 className="text-lg font-bold text-foreground mb-4">Zona taqsimoti</h3>
            <ZoneDistributionChart stats={stats} />
          </Card>
          <Card className="p-6 shadow-card hover-lift">
            <h3 className="text-lg font-bold text-foreground mb-4">Oylik trend</h3>
            <TrendChart />
          </Card>
        </div>
      </section>

      {/* KPI Analysis */}
      <section className="container pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 shadow-card hover-lift">
            <h3 className="text-lg font-bold text-foreground mb-4">KPI tahlili</h3>
            <KPIRadarChart />
          </Card>
          <Card className="p-6 shadow-card hover-lift">
            <h3 className="text-lg font-bold text-foreground mb-4">Top 10 korxonalar</h3>
            <ScoreBarChart companies={MOCK_COMPANIES} />
          </Card>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="container pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="O'rtacha ball"
            value={`${stats.avgScore}%`}
            subtitle="Barcha korxonalar bo'yicha"
            icon={TrendingUp}
            trend={{ value: 5.2, isPositive: true }}
            delay={400}
          />
          <StatCard
            title="Jami xodimlar"
            value={stats.totalEmployees.toLocaleString()}
            subtitle="Qamrab olingan"
            icon={Users}
            delay={500}
          />
        </div>
      </section>

      {/* Top Companies Ranking */}
      <section className="container pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Top Korxonalar</h2>
            <p className="text-muted-foreground">Eng yuqori reytingga ega korxonalar</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/companies")}>
            Barchasini ko'rish
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {topCompanies.map((company, index) => (
            <CompanyRankingCard 
              key={company.id} 
              company={company}
              onClick={() => navigate(`/companies/${company.id}`)}
              delay={index * 100}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;