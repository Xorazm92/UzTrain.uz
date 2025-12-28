import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY for Mehnat app')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-my-custom-header': 'uztrain-platform',
      'x-client-version': '1.0.0'
    }
  }
})

// Database connection test
export const testConnection = async () => {
  try {
    console.log('🔍 Supabase ulanishini tekshirmoqda...')
    
    const { data, error } = await supabase
      .from('banner')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase ulanish xatosi:', error)
      return { success: false, message: `Xato: ${error.message}` }
    }
    
    console.log('✅ Supabase muvaffaqiyatli ulandi')
    return { success: true, message: 'Supabase ulanishi muvaffaqiyatli' }
  } catch (error: any) {
    console.error('❌ Kutilmagan xato:', error)
    return { success: false, message: `Kutilmagan xato: ${error.message}` }
  }
}

// Database initialization
export const initializeDatabase = async () => {
  try {
    console.log('🚀 Database initsializatsiyasi boshlandi...')
    
    // Test all required tables
    const tables = [
      'banner',
      'video_materiallar', 
      'slaydlar',
      'normativ_huquqiy_hujjatlar',
      'kasb_yoriqnomalari',
      'temir_yol_hujjatlari',
      'qonunlar',
      'qarorlar',
      'qoidalar'
    ]
    
    const results = []
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1)
          
        if (error) {
          console.warn(`⚠️ Jadval ${table} mavjud emas: ${error.message}`)
          results.push({ table, status: 'missing', error: error.message })
        } else {
          console.log(`✅ Jadval ${table} tayyor`)
          results.push({ table, status: 'ready' })
        }
      } catch (err: any) {
        console.error(`❌ ${table} jadvalini tekshirishda xato:`, err)
        results.push({ table, status: 'error', error: err.message })
      }
    }
    
    return { success: true, results }
  } catch (error: any) {
    console.error('❌ Database initsializatsiya xatosi:', error)
    return { success: false, message: error.message }
  }
}

// Auto-initialize on client creation
setTimeout(() => {
  if (typeof window !== 'undefined') {
    initializeDatabase()
  }
}, 1000)
