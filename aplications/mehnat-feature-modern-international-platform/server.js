
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// CORS sozlash
app.use(cors({
  origin: ['https://uztrain.uz', 'https://www.uztrain.uz', 'http://localhost:5173', 'http://localhost:5000'],
  credentials: true
}));

// JSON parsing
app.use(express.json());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Static fayllarni serve qilish
const distPath = join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true
  }));
  console.log('✅ Serving static files from dist/');
} else {
  console.log('⚠️ dist/ folder not found. Please run "npm run build" first.');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    platform: 'UzTrain Professional Railway Education'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'UzTrain Platform API ishlamoqda',
    version: '1.0.0',
    status: 'active',
    features: [
      'Professional Railway Education',
      'Brand-aligned Design',
      'File Management System',
      'Admin Dashboard',
      'PWA Support'
    ]
  });
});

// SPA routing uchun catch-all
app.get('*', (req, res) => {
  const indexPath = join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: 'Application not built. Please run "npm run build" first.',
      message: 'UzTrain Platform build not found'
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Serverda xatolik yuz berdi',
    message: 'UzTrain Platform server error',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log('🚂 UzTrain Platform - Professional Railway Education');
  console.log('================================================');
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📱 Local: http://localhost:${port}`);
  console.log(`🌐 Network: http://0.0.0.0:${port}`);
  console.log(`🌐 Production: https://uztrain.uz`);
  console.log('🎨 Brand: Orange #E67247, Green #40964B, Dark #3C3C3C');
  console.log('================================================');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
  }
});
