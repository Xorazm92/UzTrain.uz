// Browser console'da ishlatish uchun bucket yaratish kodi
// Bu kodni browser console'ga copy-paste qiling

console.log('🚀 Supabase bucket yaratish boshlandi...');

// Supabase client'ni olish (loyihada mavjud bo'lgan)
const { supabase } = window;

if (!supabase) {
    console.error('❌ Supabase client topilmadi. Sahifani yangilang.');
} else {
    console.log('✅ Supabase client topildi');
    
    // Bucket yaratish funksiyasi
    async function createMaterialsBucket() {
        try {
            console.log('📦 Materials bucket yaratilmoqda...');
            
            const { data, error } = await supabase.storage.createBucket('materials', {
                public: true,
                allowedMimeTypes: [
                    'image/*',
                    'video/*',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                ],
                fileSizeLimit: 52428800 // 50MB
            });
            
            if (error) {
                if (error.message.includes('already exists')) {
                    console.log('✅ Materials bucket allaqachon mavjud!');
                    return true;
                } else {
                    console.error('❌ Bucket yaratishda xatolik:', error);
                    return false;
                }
            } else {
                console.log('✅ Materials bucket muvaffaqiyatli yaratildi!', data);
                return true;
            }
        } catch (error) {
            console.error('❌ Bucket yaratishda xatolik:', error);
            return false;
        }
    }
    
    // Bucket'larni tekshirish funksiyasi
    async function checkBuckets() {
        try {
            console.log('🔍 Mavjud bucket\'lar tekshirilmoqda...');
            
            const { data, error } = await supabase.storage.listBuckets();
            
            if (error) {
                console.error('❌ Bucket\'larni tekshirishda xatolik:', error);
                return false;
            }
            
            console.log('📋 Mavjud bucket\'lar:', data.map(b => b.name));
            
            const materialsBucket = data.find(bucket => bucket.name === 'materials');
            if (materialsBucket) {
                console.log('✅ Materials bucket mavjud!');
                return true;
            } else {
                console.log('⚠️ Materials bucket topilmadi');
                return false;
            }
        } catch (error) {
            console.error('❌ Bucket\'larni tekshirishda xatolik:', error);
            return false;
        }
    }
    
    // Test upload funksiyasi
    async function testUpload() {
        try {
            console.log('🧪 Upload test qilinmoqda...');
            
            const testContent = 'Bu test fayli - ' + new Date().toISOString();
            const testFile = new Blob([testContent], { type: 'text/plain' });
            const fileName = `test-${Date.now()}.txt`;
            
            const { error: uploadError } = await supabase.storage
                .from('materials')
                .upload(`test/${fileName}`, testFile);
            
            if (uploadError) {
                console.error('❌ Upload xatoligi:', uploadError);
                return false;
            } else {
                console.log('✅ Upload test muvaffaqiyatli!');
                
                // Test faylni o'chirish
                await supabase.storage
                    .from('materials')
                    .remove([`test/${fileName}`]);
                    
                console.log('🗑️ Test fayl o\'chirildi');
                return true;
            }
        } catch (error) {
            console.error('❌ Test xatoligi:', error);
            return false;
        }
    }
    
    // Asosiy funksiya
    async function setupStorage() {
        console.log('🔧 Storage setup boshlandi...');
        
        // 1. Bucket'larni tekshirish
        const bucketExists = await checkBuckets();
        
        // 2. Agar bucket yo'q bo'lsa, yaratish
        if (!bucketExists) {
            const created = await createMaterialsBucket();
            if (!created) {
                console.error('❌ Bucket yaratib bo\'lmadi');
                return false;
            }
        }
        
        // 3. Upload test
        const uploadWorks = await testUpload();
        if (!uploadWorks) {
            console.error('❌ Upload test muvaffaqiyatsiz');
            return false;
        }
        
        console.log('🎉 Storage to\'liq sozlandi! Endi slide yuklash ishlaydi.');
        return true;
    }
    
    // Setup'ni ishga tushirish
    setupStorage();
}

// Manual ishlatish uchun funksiyalar
window.createMaterialsBucket = async function() {
    const { supabase } = window;
    const { data, error } = await supabase.storage.createBucket('materials', {
        public: true,
        allowedMimeTypes: ['image/*', 'video/*', 'application/pdf'],
        fileSizeLimit: 52428800
    });
    
    if (error && !error.message.includes('already exists')) {
        console.error('Xatolik:', error);
    } else {
        console.log('✅ Bucket yaratildi!');
    }
};

console.log('💡 Manual bucket yaratish uchun: createMaterialsBucket()');
