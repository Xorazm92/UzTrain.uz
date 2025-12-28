// ===================================
// AUTOMATIC DATA MIGRATION & FIX
// ===================================

/**
 * Bu funksiya barcha mavjud korxonalarni tekshiradi va
 * agar level yoki supervisorId bo'lmasa, ularni avtomatik to'g'rilaydi
 */
function fixExistingCompanies() {
    console.log("🔧 Mavjud korxonalarni tekshirish va tuzatish...");

    let fixedCount = 0;

    companies.forEach(company => {
        let needsUpdate = false;

        // Agar level bo'lmasa, default qiymat
        if (!company.level) {
            company.level = 'subsidiary'; // Default: oddiy korxona
            needsUpdate = true;
            console.log(`➕ ${company.name}: level qo'shildi (subsidiary)`);
        }

        // Agar supervisorId bo'lmasa va level subsidiary bo'lsa
        if (!company.supervisorId && company.level === 'subsidiary') {
            // Default: Toshkent MTU ga biriktirish
            // (Siz keyin tahrirlashda to'g'ri tashkilotni tanlaysiz)
            company.supervisorId = 'toshkent_mtu';
            needsUpdate = true;
            console.log(`➕ ${company.name}: supervisorId qo'shildi (toshkent_mtu)`);
        }

        // Agar supervisorId bo'lmasa va level supervisor bo'lsa
        if (!company.supervisorId && company.level === 'supervisor') {
            company.supervisorId = 'aj_head';
            needsUpdate = true;
            console.log(`➕ ${company.name}: supervisorId qo'shildi (aj_head)`);
        }

        if (needsUpdate) {
            fixedCount++;

            // Firebase'ga saqlash
            if (db) {
                db.collection("companies").doc(company.id).set(company, { merge: true })
                    .then(() => console.log(`✅ ${company.name}: Firebase'ga saqlandi`))
                    .catch(err => console.error(`❌ ${company.name}: Saqlashda xato:`, err));
            }
        }
    });

    if (fixedCount > 0) {
        console.log(`✅ ${fixedCount} ta korxona tuzatildi!`);

        // LocalStorage'ga saqlash
        localStorage.setItem('mm_companies', JSON.stringify(companies));

        // UI ni yangilash
        setTimeout(() => {
            refreshUI();
            alert(`✅ ${fixedCount} ta korxona avtomatik tuzatildi!\n\nEndi "Toshkent MTU" filtri ishlaydi.\n\nKeyin har bir korxonani tahrirlashda to'g'ri "Yuqori Tashkilot"ni tanlashingiz mumkin.`);
        }, 1000);
    } else {
        console.log("✅ Barcha korxonalar to'g'ri!");
    }
}

// Sahifa yuklanganda avtomatik tekshirish
document.addEventListener('DOMContentLoaded', () => {
    // 2 soniya kutib, keyin tekshirish (ma'lumotlar yuklanishi uchun)
    setTimeout(() => {
        if (companies.length > 0) {
            fixExistingCompanies();
        }
    }, 2000);
});
