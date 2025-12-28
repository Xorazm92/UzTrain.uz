import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Train, Mail, Phone, MapPin, Facebook, Twitter, Instagram,
  Youtube, ArrowRight, Heart, Shield, Award, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = {
    platform: [
      { name: 'Qonunlar', href: '/qonunlar' },
      { name: 'Qoidalar', href: '/qoidalar' },
      { name: 'Slaydlar', href: '/slaydlar' },
      { name: 'Bannerlar', href: '/bannerlar' },
    ],
    resources: [
      { name: 'Kasb Yo\'riqnomalari', href: '/kasb-yoriqnomalari' },
      { name: 'Temir Yo\'l Hujjatlari', href: '/temir-yol' },
      { name: 'Video Materiallar', href: '/video-materiallar' },
      { name: 'Yangiliklar', href: '/news' },
    ],
    support: [
      { name: 'Yordam Markazi', href: '/help' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Bog\'lanish', href: '/contact' },
      { name: 'Texnik Qo\'llab-quvvatlash', href: '/support' },
    ]
  };

  return (
    <footer className="bg-gradient-to-br from-brand-dark via-slate-800 to-brand-dark text-white">
      {/* Brand Newsletter Section */}
      <div className="border-b border-brand-orange/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Train className="h-4 w-4" />
              Professional Ta'lim Platformasi
            </div>
            <h3 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-brand-orange to-brand-green bg-clip-text text-transparent">
                Yangilanishlardan birinchi bo'lib xabardor bo'ling
              </span>
            </h3>
            <p className="text-slate-300 mb-8 text-lg">
              Yangi materiallar, kurslar va muhim yangiliklar haqida email orqali xabar oling
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Email manzilingiz"
                className="bg-white/10 border-brand-orange/30 text-white placeholder:text-gray-300"
              />
              <Button className="bg-gradient-primary hover:opacity-90 px-8 py-3 rounded-full font-semibold">
                <Mail className="h-4 w-4 mr-2" />
                Obuna bo'lish
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <img
                src="/logo-dark.png"
                alt="UzTrain Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-orange to-brand-green bg-clip-text text-transparent">
                  UzTrain
                </h3>
                <p className="text-slate-400 text-sm">Professional Ta'lim Platformasi</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              O'zbekiston temir yo'llari xodimlari uchun zamonaviy ta'lim va malaka oshirish platformasi.
              Sizning brand guide'ingiz asosida yaratilgan professional xavfsizlik ta'limi.
            </p>

            {/* Brand Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="h-4 w-4 text-brand-orange" />
                <span className="text-sm">Toshkent, O'zbekiston</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="h-4 w-4 text-brand-green" />
                <span className="text-sm">+998 (97) 777-10-53</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="h-4 w-4 text-brand-orange" />
                <span className="text-sm">info@uztrain.uz</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Platforma</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resurslar</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Qo'llab-quvvatlash</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-700">
          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <div className="font-semibold text-white">100% Xavfsiz</div>
              <div className="text-sm">SSL shifrlash va ma'lumotlar himoyasi</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="font-semibold text-white">Sertifikatlangan</div>
              <div className="text-sm">Rasmiy ta'lim sertifikatlari</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <div className="font-semibold text-white">24/7 Qo'llab-quvvatlash</div>
              <div className="text-sm">Har doim yordam va maslahat</div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Bottom Bar */}
      <div className="border-t border-brand-orange/20 bg-brand-dark/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>© 2025 UzTrain Platform.</span>
              <span>Barcha huquqlar himoyalangan.</span>
              <span className="flex items-center gap-1">
                Ishlab chiqildi <Heart className="h-3 w-3 text-brand-orange" /> bilan
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link to="/terms" className="text-slate-400 hover:text-brand-orange transition-colors">
                Foydalanish Shartlari
              </Link>
              <Link to="/privacy" className="text-slate-400 hover:text-brand-green transition-colors">
                Maxfiylik Siyosati
              </Link>
              <Link to="/cookies" className="text-slate-400 hover:text-brand-orange transition-colors">
                Cookie Siyosati
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
