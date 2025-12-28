import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { RailwayHero } from '@/components/RailwayHero';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import {
  Search,
  Award,
  BarChart3,
  ArrowRight,
  Shield,
  Zap,
  Target,
  Globe,
  Clock,
  CheckCircle,
  Users
} from 'lucide-react';

const RailwayIndex = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "SafeDocs",
    "alternateName": "SafeDocs Xavfsizlik Ta'limi Platformasi",
    "description": "O'zbekiston temir yo'llari xodimlari uchun professional xavfsizlik ta'limi va mehnat muhofazasi platformasi",
    "url": "https://safedocs.uz",
    "logo": "https://safedocs.uz/logo.png",
    "image": "https://safedocs.uz/icons/icon-512x512.png",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "UZ",
      "addressRegion": "Toshkent",
      "addressLocality": "Toshkent"
    },
    "sameAs": [
      "https://t.me/SafeDocsUZ",
      "https://facebook.com/SafeDocsUZ"
    ],
    "offers": [
      {
        "@type": "Course",
        "name": "Elektr Xavfsizligi Ta'limi",
        "description": "Elektr qurilmalari bilan xavfsiz ishlash bo'yicha ta'lim",
        "provider": {
          "@type": "Organization",
          "name": "SafeDocs"
        }
      },
      {
        "@type": "Course", 
        "name": "Yong'in Xavfsizligi Ta'limi",
        "description": "Yong'in xavfsizligi va evakuatsiya qoidalari",
        "provider": {
          "@type": "Organization",
          "name": "SafeDocs"
        }
      }
    ],
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "Xavfsizlik bo'yicha Sertifikat"
    }
  };

  return (
    <div className="min-h-screen bg-railway-dark responsive-container railway-theme">
      <SEO 
        title="SafeDocs - O'zbekiston Temir Yo'llari Xavfsizlik Ta'limi Platformasi | Mehnat Muhofazasi"
        description="O'zbekiston temir yo'llari xodimlari uchun professional xavfsizlik ta'limi, mehnat muhofazasi qoidalari, interaktiv video materiallar va sertifikatlashtirish. Elektr xavfsizligi, yong'in xavfsizligi, sanoat xavfsizligi bo'yicha to'liq ta'lim dasturlari."
        keywords="xavfsizlik ta'limi, mehnat muhofazasi, temir yo'l xavfsizligi, elektr xavfsizligi, yong'in xavfsizligi, sanoat xavfsizligi, SafeDocs, O'zbekiston temir yo'llari, professional ta'lim, sertifikatlashtirish"
        type="website"
        structuredData={organizationData}
      />
      <Navbar />

      {/* Railway.com Style Hero Section */}
      <RailwayHero />

      {/* Railway-style sections with dark theme */}
      <div className="bg-railway-dark text-white">
        {/* Quick Actions Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 railway-text-gradient">Xodimlar Uchun Asosiy Xizmatlar</h2>
            <p className="text-gray-400">Mehnat muhofazasi bo'yicha eng muhim funksiyalar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="railway-card p-6 text-center group cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Xavfsizlik Qoidalari</h3>
              <p className="text-gray-400 mb-4">Mehnat muhofazasi bo'yicha qonun va qoidalar</p>
              <Button asChild className="railway-button w-full">
                <Link to="/qonunlar">
                  O'rganish
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="railway-card p-6 text-center group cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Malaka Oshirish</h3>
              <p className="text-gray-400 mb-4">Xodimlar uchun sertifikatlashtirish dasturlari</p>
              <Button asChild className="railway-button w-full">
                <Link to="/qoidalar">
                  Boshlash
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="railway-card p-6 text-center group cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Bilim Baholash</h3>
              <p className="text-gray-400 mb-4">Xodimlar bilimini tekshirish va monitoring</p>
              <Button asChild className="railway-button w-full">
                <Link to="/video-materiallar">
                  Testdan O'tish
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-railway-secondary/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 railway-text-gradient">Xodimlar Uchun Afzalliklar</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Mehnat muhofazasi sohasida professional bilim va ko'nikmalarni oshirish uchun zamonaviy yechimlar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="railway-card p-6 text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Xavfsizlik Ta'limi</h3>
                <p className="text-gray-400">
                  Temir yo'l xavfsizligi bo'yicha professional bilim va amaliy ko'nikmalar
                </p>
              </div>

              <div className="railway-card p-6 text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Tez O'rganish</h3>
                <p className="text-gray-400">
                  Interaktiv darslar va amaliy mashg'ulotlar orqali samarali ta'lim
                </p>
              </div>

              <div className="railway-card p-6 text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Maqsadli Ta'lim</h3>
                <p className="text-gray-400">
                  Har bir lavozim uchun maxsus ishlab chiqilgan ta'lim dasturlari
                </p>
              </div>

              <div className="railway-card p-6 text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Qulay Interfeys</h3>
                <p className="text-gray-400">
                  Barcha xodimlar uchun tushunarli va foydalanish oson interfeys
                </p>
              </div>

              <div className="railway-card p-6 text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">24/7 Mavjudlik</h3>
                <p className="text-gray-400">
                  Istalgan vaqtda ta'lim olish va bilimlarni yangilash imkoniyati
                </p>
              </div>

              <div className="railway-card p-6 text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Sertifikatlashtirish</h3>
                <p className="text-gray-400">
                  Rasmiy sertifikatlar va malaka oshirish hujjatlari
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Employee-focused CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="railway-card p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4 railway-text-gradient">
                  Xodimlar Xavfsizligi - Bizning Ustuvor Yo'nalishimiz
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Har bir xodimning xavfsizligi va professional rivojlanishi uchun zamonaviy ta'lim
                  dasturlari, amaliy mashg'ulotlar va sertifikatlashtirish imkoniyatlari
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="railway-button text-lg px-8 py-4">
                    <Link to="/qonunlar">
                      <Shield className="mr-2 h-5 w-5" />
                      Ta'limni Boshlash
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="railway-card border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
                    <Link to="/slaydlar">
                      <Users className="mr-2 h-5 w-5" />
                      Xodimlar Statistikasi
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Footer */}
      <Footer />
    </div>
  );
};

export default RailwayIndex;
