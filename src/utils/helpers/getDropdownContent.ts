import DropdownItemType from "../../types/DropdownItemType";
import storeType from "../../types/store";

const getDropdownItems = (state: storeType) => {
    let content: DropdownItemType[] = [];

    switch (state.section) {
        case "logo":
            content = [
                {
                    name: "Ushbu Mac Haqida",
                    available: true,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Tizim Sozlamalari",
                    available: true,
                },
                {
                    name: "App Store",
                    available: true,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Oynani Yashirish",
                    available: true,
                },
                {
                    name: "Boshqalarni Yashirish",
                    available: true,
                },
                {
                    name: "Hammasini Ko'rsatish",
                    available: true,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Oxirgi Vaqtlar",
                    available: true,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Majburiy Chiqish",
                    available: true,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Uyqu Rejimi",
                    available: true,
                },
                {
                    name: "Qayta Yuklash",
                    available: true,
                },
                {
                    name: "O'chirish",
                    available: true,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Ekran Qulfi",
                    available: true,
                },
                {
                    name: "Chiqish",
                    available: true,
                },

            ];
            break;
        case "finder":
            content = [
                {
                    name: "Finder Haqida",
                    available: true,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Sozlamalar",
                    available: true,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Chiqindini Tozalash",
                    available: true,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Finderni Yashirish",
                    available: true,
                },
                {
                    name: "Boshqalarni Yashirish",
                    available: true,
                },
                {
                    name: "Hammasini Ko'rsatish",
                    available: true,
                }
            ];
            break;
        case "file":
            content = [
                {
                    name: "Yangi Finder Oynasi",
                    available: true,
                },
                {
                    name: "Yangi Jild",
                    available: true,
                },
                {
                    name: "Yangi Tab",
                    available: true,
                },
                {
                    name: "Ochish",
                    available: false,
                },
                {
                    name: "Bilan Ochish",
                    available: false,
                },
                {
                    name: "Chop Etish",
                    available: false,
                },
                {
                    name: "Oynani Yopish",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Ma'lumot Olish",
                    available: true,
                },
                {
                    name: "Nomni O'zgartirish",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Nusxalash",
                    available: false,
                },
                {
                    name: "Taxallus Yaratish",
                    available: false,
                },
                {
                    name: "Tezkor Ko'rish",
                    available: false,
                },
                {
                    name: "Aslini Ko'rsatish",
                    available: false,
                },
                {
                    name: "Yon Panelga Qo'shish",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Chiqindiga Tashlash",
                    available: false,
                },
                {
                    name: "Chiqarish",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Qidirish",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Teglar",
                    available: false,
                },
            ];
            break;

        case "edit":
            content = [
                {
                    name: "Bekor Qilish",
                    available: false,
                },
                {
                    name: "Qaytarish",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Kesish",
                    available: false,
                },
                {
                    name: "Nusxalash",
                    available: false,
                },
                {
                    name: "Joylashtirish",
                    available: false,
                },
                {
                    name: "Hammasini Tanlash",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Arxivni Ko'rsatish",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Diktofonni Boshlash",
                    available: false,
                },
                {
                    name: "Emoji va Belgilar",
                    available: true,
                },
            ]
            break;

        case "view":
            content = [
                {
                    name: "Belgilar Kabi",
                    available: true,
                },
                {
                    name: "Ro'yxat Kabi",
                    available: true,
                },
                {
                    name: "Ustunlar Kabi",
                    available: true,
                },
                {
                    name: "Galereya Kabi",
                    available: true,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "To'plamlardan Foydalanish",
                    available: false,
                },
                {
                    name: "Saralash",
                    available: false,
                },
                {
                    name: "Tozalash",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Yon Panelni Yashirish",
                    available: false,
                },
                {
                    name: "Ko'rib Chiqish",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Asboblar Panelini Yashirish",
                    available: false,
                },
                {
                    name: "Barcha Tablarni Ko'rsatish",
                    available: false,
                },
                {
                    name: "Tab Panelini Ko'rsatish",
                    available: false,
                },
                {
                    name: "Status Panelini Ko'rsatish",
                    available: false,
                },
                {
                    name: "Tab Panelini To'liq Ekranda Ko'rsatish",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Ko'rinish Sozlamalari",
                    available: false,
                },
                {
                    name: "Ko'rib Chiqish Sozlamalari",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "To'liq Ekranga O'tish",
                    available: false,
                },
            ];
            break;

        case "go":
            content = [
                {
                    name: "Orqaga",
                    available: false,
                },
                {
                    name: "Oldinga",
                    available: false,
                },
                {
                    name: "O'rab Turgan Jild",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Oxirgilar",
                    available: false,
                },
                {
                    name: "Hujjatlar",
                    available: false,
                },
                {
                    name: "Ish Stoli",
                    available: false,
                },
                {
                    name: "Yuklanmalar",
                    available: false,
                },
                {
                    name: "Uy",
                    available: true,
                },
                {
                    name: "Kompyuter",
                    available: true,
                },
                {
                    name: "Airdrop",
                    available: true,
                },
                {
                    name: "Tarmoq",
                    available: true,
                },
                {
                    name: "iCloud Drive",
                    available: true,
                },
                {
                    name: "Ilovalar",
                    available: true,
                },
                {
                    name: "Utilitlar",
                    available: true,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Jildga O'tish",
                    available: false,
                },
                {
                    name: "Serverga Ulanish",
                    available: false,
                },
            ];
            break;
        case "window":
            content = [
                {
                    name: "Kichraytirish",
                    available: false,
                },
                {
                    name: "Kattalashtirish",
                    available: false,
                },
                {
                    name: "Oynani Chapga O'tkazish",
                    available: false,
                },
                {
                    name: "Oynani O'ngga O'tkazish",
                    available: false,
                },
                {
                    name: "Oynalar Orasida O'tish",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Oldingi Tab",
                    available: false,
                },
                {
                    name: "Keyingi Tab",
                    available: false,
                },
                {
                    name: "Oynani Yangi Tabga O'tkazish",
                    available: false,
                },
                {
                    name: "Oynalarni Birlashtirish",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "Barcha Oynalarni Oldinga",
                    available: false,
                },
            ];
            break;

        case "help":
            content = [
                {
                    name: "Finder Haqida Fikr Yuborish",
                    available: false,
                },
                {
                    name: "divider",
                    available: false,
                },
                {
                    name: "macOS Yordam",
                    available: false,
                },
            ];
            break;
    }
    return content;

};

export default getDropdownItems;