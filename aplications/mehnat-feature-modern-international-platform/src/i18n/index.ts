import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  uz: {
    translation: {
      // Navigation
      nav: {
        home: "Bosh sahifa",
        laws: "Qonunlar",
        rules: "Qoidalar",
        videos: "Video Materiallar",
        slides: "Slaydlar",
        railway: "Temir Yol Hujjatlari",
        banners: "Bannerlar",
        manuals: "Kasb Yoriqnomalari"
      },
      // Hero section
      hero: {
        title: "UzTrain - Temir Yo'l Ta'limi",
        subtitle: "O'zbekiston temir yo'llari xodimlari uchun zamonaviy ta'lim va malaka oshirish platformasi"
      },
      // Categories
      categories: {
        title: "Kategoriyalar",
        subtitle: "Ta'lim materiallarini kategoriyalar bo'yicha ko'ring",
        laws: {
          name: "Qonunlar",
          description: "Normativ huquqiy hujjatlar"
        },
        rules: {
          name: "Qoidalar",
          description: "Davlat organlari qarorlari"
        },
        videos: {
          name: "Video Materiallar",
          description: "Ta'lim videolari"
        },
        slides: {
          name: "Slaydlar",
          description: "Trening slaydlari"
        },
        manuals: {
          name: "Kasb Yoriqnomalari",
          description: "Kasb yo'riqnomalari"
        },
        railway: {
          name: "Temir Yol Hujjatlari",
          description: "Temir yo'l hujjatlari"
        },
        banners: {
          name: "Bannerlar",
          description: "Xavfsizlik bannerlari"
        }
      },
      // Recent materials
      recent: {
        title: "So'nggi Materiallar",
        subtitle: "Yangi qo'shilgan ta'lim materiallari",
        viewAll: "Barchasini ko'rish"
      },
      // Common
      common: {
        loading: "Yuklanmoqda...",
        error: "Xatolik yuz berdi",
        retry: "Qayta urinish",
        view: "Ko'rish",
        open: "Ochish",
        close: "Yopish",
        save: "Saqlash",
        cancel: "Bekor qilish",
        search: "Qidirish",
        filter: "Filtrlash",
        sort: "Saralash",
        materials: "materiallar",
        material: "material"
      },
      // Safety levels
      safety: {
        industrial: "Sanoat xavfsizligi",
        labor: "Mehnat muhofazasi",
        health: "Sog'liqni saqlash",
        traffic: "Yo'l harakati",
        fire: "Yong'in xavfsizligi",
        electrical: "Elektr xavfsizligi"
      },
      // Footer
      footer: {
        tagline: "Temir yo'l ta'limi - kelajak sari yo'l.",
        copyright: "UzTrain Platform © 2024 - Barcha huquqlar himoyalangan"
      }
    }
  },
  ru: {
    translation: {
      nav: {
        home: "Главная",
        laws: "Законы",
        rules: "Правила",
        videos: "Видеоматериалы",
        slides: "Слайды",
        railway: "Железнодорожные документы",
        banners: "Баннеры",
        manuals: "Профессиональные руководства"
      },
      hero: {
        title: "UzTrain - Железнодорожное обучение",
        subtitle: "Современная платформа обучения и повышения квалификации для сотрудников железных дорог Узбекистана"
      },
      categories: {
        title: "Категории",
        subtitle: "Просмотрите учебные материалы по категориям",
        laws: {
          name: "Законы",
          description: "Нормативно-правовые документы"
        },
        rules: {
          name: "Правила",
          description: "Решения государственных органов"
        },
        videos: {
          name: "Видеоматериалы",
          description: "Обучающие видео"
        },
        slides: {
          name: "Слайды",
          description: "Тренинговые слайды"
        },
        manuals: {
          name: "Профессиональные руководства",
          description: "Профессиональные руководства"
        },
        railway: {
          name: "Железнодорожные документы",
          description: "Железнодорожные документы"
        },
        banners: {
          name: "Баннеры",
          description: "Баннеры безопасности"
        }
      },
      recent: {
        title: "Последние материалы",
        subtitle: "Недавно добавленные учебные материалы",
        viewAll: "Посмотреть все"
      },
      common: {
        loading: "Загрузка...",
        error: "Произошла ошибка",
        retry: "Повторить",
        view: "Просмотр",
        open: "Открыть",
        close: "Закрыть",
        save: "Сохранить",
        cancel: "Отмена",
        search: "Поиск",
        filter: "Фильтр",
        sort: "Сортировка",
        materials: "материалов",
        material: "материал"
      },
      safety: {
        industrial: "Промышленная безопасность",
        labor: "Охрана труда",
        health: "Охрана здоровья",
        traffic: "Дорожное движение",
        fire: "Пожарная безопасность",
        electrical: "Электробезопасность"
      },
      footer: {
        tagline: "Железнодорожное образование - путь в будущее.",
        copyright: "UzTrain Platform © 2024 - Все права защищены"
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        laws: "Laws",
        rules: "Rules",
        videos: "Video Materials",
        slides: "Slides",
        railway: "Railway Documents",
        banners: "Banners",
        manuals: "Professional Manuals"
      },
      hero: {
        title: "UzTrain - Railway Education",
        subtitle: "Modern training and professional development platform for Uzbekistan Railways employees"
      },
      categories: {
        title: "Categories",
        subtitle: "Browse educational materials by categories",
        laws: {
          name: "Laws",
          description: "Regulatory legal documents"
        },
        rules: {
          name: "Rules",
          description: "Government decisions"
        },
        videos: {
          name: "Video Materials",
          description: "Educational videos"
        },
        slides: {
          name: "Slides",
          description: "Training slides"
        },
        manuals: {
          name: "Professional Manuals",
          description: "Professional manuals"
        },
        railway: {
          name: "Railway Documents",
          description: "Railway documents"
        },
        banners: {
          name: "Banners",
          description: "Safety banners"
        }
      },
      recent: {
        title: "Recent Materials",
        subtitle: "Recently added educational materials",
        viewAll: "View All"
      },
      common: {
        loading: "Loading...",
        error: "An error occurred",
        retry: "Retry",
        view: "View",
        open: "Open",
        close: "Close",
        save: "Save",
        cancel: "Cancel",
        search: "Search",
        filter: "Filter",
        sort: "Sort",
        materials: "materials",
        material: "material"
      },
      safety: {
        industrial: "Industrial Safety",
        labor: "Occupational Health",
        health: "Health Protection",
        traffic: "Traffic Safety",
        fire: "Fire Safety",
        electrical: "Electrical Safety"
      },
      footer: {
        tagline: "Railway education - the path to the future.",
        copyright: "UzTrain Platform © 2024 - All rights reserved"
      }
    }
  }
};

// O'zbek tilini default qilib qo'yish
if (!localStorage.getItem('i18nextLng')) {
  localStorage.setItem('i18nextLng', 'uz');
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'uz', // Default til o'zbek tili
    fallbackLng: 'uz',
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
