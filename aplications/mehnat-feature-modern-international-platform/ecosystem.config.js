module.exports = {
  apps: [
    {
      name: 'uztrain-platform',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        VITE_SUPABASE_URL: 'https://hbzmwbkcogzbgeykxnoc.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhiem13Ymtjb2d6YmdleWt4bm9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzkwNjEsImV4cCI6MjA2NzcxNTA2MX0.t1z6SR4J5PmI2lhWTf9lEJzTd3s6bLCXQSe6zxNKYT8',
        VITE_APP_TITLE: 'UzTrain Platform',
        VITE_APP_DESCRIPTION: "O'zbekiston Temir Yo'l Ta'limi Platformasi",
        VITE_APP_VERSION: '1.0.0',
        VITE_APP_DOMAIN: 'uztrain.uz',
        VITE_ENABLE_PWA: 'true',
        VITE_ENABLE_ANALYTICS: 'true',
        VITE_ENABLE_LOCAL_FALLBACK: 'true'
      },
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_restarts: 5,
      min_uptime: '10s',
      max_memory_restart: '500M'
    }
  ]
};