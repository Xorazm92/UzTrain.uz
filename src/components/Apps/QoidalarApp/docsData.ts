export interface DocItem {
    id: number;
    title: string;
    link: string;
    category: string;
}

export type DocType = 'qonunlar' | 'qarorlar' | 'qoidalar';

export const docsData: Record<DocType, DocItem[]> = {
    qonunlar: [
        {
            id: 1,
            title: "Mehnatni muhofaza qilish toʻgʻrisida Qonun",
            link: "https://lex.uz/uz/docs/-3031427",
            category: "Mehnat muhofazasi"
        },
        {
            id: 2,
            title: "Xavfli ishlab chiqarish obyektlarining sanoat xavfsizligi toʻgʻrisida Qonun",
            link: "https://www.lex.uz/docs/-1061181",
            category: "Sanoat xavfsizligi"
        },
        {
            id: 3,
            title: "Yongʻin xavfsizligi toʻgʻrisida Qonun",
            link: "https://lex.uz/docs/-1521661",
            category: "Yong’in xavfsizligi"
        },
        {
            id: 4,
            title: "Ekologik nazorat toʻgʻrisida Qonun",
            link: "http://lex.uz/ru/docs/-2304953",
            category: "Ekologik nazorat"
        },
        {
            id: 5,
            title: "Fuqarolar sogʻligʻini saqlash toʻgʻrisida Qonun",
            link: "https://lex.uz/ru/docs/-26013",
            category: "Sog’liqni saqlash"
        },
        {
            id: 6,
            title: "Yoʻl harakati toʻgʻrisida Qonun",
            link: "https://lex.uz/docs/-6764454",
            category: "Yo’l harakati"
        }
    ],
    qarorlar: [
        {
            id: 1,
            title: "Mehnatni muhofaza qilish sohasiga ayrim nizomlarni tasdiqlash to’g’risidagi qaror",
            link: "https://lex.uz/ru/docs/-7942768",
            category: "Mehnat muhofazasi"
        },
        {
            id: 2,
            title: "Xavfli ishlab chiqarish obyektlarining sanoat xavfsizligi toʻgʻrisidagi qonunni amalga oshirishga doir qoʻshimcha chora-tadbirlar haqida",
            link: "https://lex.uz/docs/-1413931",
            category: "Sanoat xavfsizligi"
        },
        {
            id: 3,
            title: "Yongʻin xavfsizligi toʻgʻrisidagi qonunni amalga oshirish chora-tadbirlari haqida",
            link: "https://lex.uz/docs/-2149546",
            category: "Yong’in xavfsizligi"
        },
        {
            id: 4,
            title: "Davlat ekologik nazoratini amalga oshirish tartibi toʻgʻrisidagi nizomni tasdiqlash haqida",
            link: "https://www.lex.uz/docs/-2443091",
            category: "Ekologik nazorat"
        },
        {
            id: 5,
            title: "Isteъmolчилар электр қурилмаларини техник эксплуатация қилиш қоидалари va xavfsizlik texnikasi qoidalarini tasdiqlash to'g'risida",
            link: "https://lex.uz/uz/docs/5091758",
            category: "Elektr xavfsizligi"
        },
        {
            id: 6,
            title: "Mehnatni muhofaza qilishni boshqarish tizimini joriy etish toʻgʻrisida",
            link: "https://lex.uz/uz/docs/-7640822",
            category: "Mehnat muhofazasi"
        },
        {
            id: 7,
            title: "Xavfli ishlab chiqarish obyektlarining sanoat xavfsizligi toʻgʻrisidagi qonunni amalga oshirishga doir qoʻshimcha chora-tadbirlar toʻgʻrisida",
            link: "https://lex.uz/docs/4817439",
            category: "Sanoat xavfsizligi"
        },
        {
            id: 8,
            title: "Gaz xoʻjaligida xavfsizlik qoidalarini tasdiqlash toʻgʻrisida",
            link: "https://lex.uz/docs/-4244878",
            category: "Sanoat xavfsizligi"
        },
        {
            id: 9,
            title: "Elektr qurilmalarini ekspluatatsiya qilishda texnika xavfsizligi qoidalarini tasdiqlash toʻgʻrisida",
            link: "https://lex.uz/docs/-5038211",
            category: "Elektr xavfsizligi"
        },
        {
            id: 10,
            title: "Xodimlarga yetkazilgan zararni toʻlash qoidalarini tasdiqlash toʻgʻrisida",
            link: "https://lex.uz/ru/docs/-492899",
            category: "Mehnat muhofazasi"
        },
        {
            id: 11,
            title: "Ishlab chiqarishdagi baxtsiz hodisalarni tekshirish va hisobga olish toʻgʻrisidagi nizomni tasdiqlash haqida",
            link: "https://lex.uz/docs/-545128",
            category: "Mehnat muhofazasi"
        },
        {
            id: 12,
            title: "Ish beruvchining fuqarolik javobgarligini majburiy sugʻurta qilish toʻgʻrisidagi qonunni amalga oshirish chora-tadbirlari haqida",
            link: "https://lex.uz/docs/-1493389",
            category: "Mehnat muhofazasi"
        },
        {
            id: 13,
            title: "Imtiyozli shartlarda pensiyaga chiqish huquqini beruvchi ishlab chiqarishlar roʻyxatini tasdiqlash haqida",
            link: "https://lex.uz/uz/docs/-7765716",
            category: "Mehnat muhofazasi"
        },
        {
            id: 14,
            title: "Xodimlar mehnatini muhofaza qilish chora-tadbirlarini yanada takomillashtirish toʻgʻrisida",
            link: "https://lex.uz/docs/-2463973",
            category: "Mehnat muhofazasi"
        }
    ],
    qoidalar: [
        {
            id: 1,
            title: "Balandlikda ishlaganda mehnatni muhofaza qilish qoidalarini tasdiqlash haqida",
            link: "https://lex.uz/docs/1433207",
            category: "Mehnat muhofazasi"
        },
        {
            id: 2,
            title: "Xavfli ishlab chiqarish obyektlarida ishlab chiqarish nazoratini tashkil etish va amalga oshirish qoidalarini tasdiqlash toʻgʻrisida",
            link: "https://lex.uz/docs/-1808749",
            category: "Sanoat xavfsizligi"
        },
        {
            id: 3,
            title: "Gazdan xavfli ishlarni xavfsiz olib borishni tashkillashtirish boʻyicha namunaviy yoʻriqnomani tasdiqlash toʻgʻrisida",
            link: "https://lex.uz/docs/-1851864",
            category: "Gaz xo'jaligi"
        },
        {
            id: 4,
            title: "Oʻn sakkiz yoshgacha boʻlgan xodimlar koʻtarishlari va tashishlari mumkin boʻlgan ogʻir yuk normalarining chegarasini belgilash toʻgʻrisida",
            link: "https://lex.uz/ru/docs/-1479061",
            category: "Mehnat muhofazasi"
        },
        {
            id: 5,
            title: "Yuk koʻtargich (minora)larni oʻrnatish va ulardan foydalanishda xavfsizlik qoidalarini tasdiqlash toʻgʻrisida",
            link: "https://lex.uz/ru/docs/-1935733",
            category: "Sanoat xavfsizligi"
        },
        {
            id: 6,
            title: "Temir yoʻl transporti taʼmirlash tashkilotlari xodimlari uchun mehnatni muhofaza qilish qoidalarini tasdiqlash haqida",
            link: "https://lex.uz/ru/docs/-1578222",
            category: "Transport"
        },
        {
            id: 7,
            title: "Neft bazalari, turgʻun, konteynerli va koʻchma avtoyoqilgʻi quyish shoxobchalaridan foydalanishda xavfsizlik qoidalarini tasdiqlash haqida",
            link: "https://lex.uz/uz/docs/-2386922",
            category: "Neft-gaz"
        },
        {
            id: 8,
            title: "Avtotransport vositalari haydovchilarining ish vaqti va dam olish vaqti toʻgʻrisida nizomni tasdiqlash haqida",
            link: "https://lex.uz/docs/-2234877",
            category: "Transport"
        },
        {
            id: 9,
            title: "Bugʻ va issiq suv quvurlari qurish va ulardan foydalanishda mehnatni muhofaza qilish qoidalarini tasdiqlash toʻgʻrisida",
            link: "https://lex.uz/docs/-2514335",
            category: "Sanoat xavfsizligi"
        },
        {
            id: 10,
            title: "Ortiqcha bosimli suv isitish qozonlari, suv isitgichlar va bugʻ qozonlarini oʻrnatish va ulardan foydalanishda mehnatni muhofaza qilish qoidalarini tasdiqlash toʻgʻrisida",
            link: "https://lex.uz/docs/-2818096",
            category: "Sanoat xavfsizligi"
        },
        {
            id: 11,
            title: "Yuk koʻtarish mashinalarini xavfsiz ishlatishni nazorat qiluvchi muhandis-texnik xodimlar uchun namunaviy yoʻriqnomani tasdiqlash haqida",
            link: "https://lex.uz/uz/docs/-2821982",
            category: "Sanoat xavfsizligi"
        },
        {
            id: 12,
            title: "Yuk ko'tarish kranlari tuzilishi va ularni xavfsiz ishlatish qoidalari",
            link: "https://api-portal.gov.uz/uploads/c9cc58b8-559d-1fb1-805b-d66981dcc05e_media_.pdf",
            category: "Sanoat xavfsizligi"
        }
    ]
};
