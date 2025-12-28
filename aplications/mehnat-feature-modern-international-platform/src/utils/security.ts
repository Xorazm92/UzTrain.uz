// Security utilities for the platform

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// File validation
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'application/pdf',
    'video/mp4',
    'video/webm',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'Fayl hajmi 50MB dan oshmasligi kerak' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Fayl turi qo\'llab-quvvatlanmaydi' };
  }

  return { valid: true };
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Content Security Policy headers
export const getCSPHeaders = () => ({
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob: https:",
    "connect-src 'self' https://api.supabase.co wss://realtime.supabase.co",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
});

// Rate limiting (client-side)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key)!;
    
    // Remove old requests
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Session management
export const sessionManager = {
  setSecureItem: (key: string, value: string) => {
    try {
      const encrypted = btoa(value); // Simple encoding (use proper encryption in production)
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to set secure item:', error);
    }
  },

  getSecureItem: (key: string): string | null => {
    try {
      const encrypted = sessionStorage.getItem(key);
      return encrypted ? atob(encrypted) : null;
    } catch (error) {
      console.error('Failed to get secure item:', error);
      return null;
    }
  },

  removeSecureItem: (key: string) => {
    sessionStorage.removeItem(key);
  },

  clearSession: () => {
    sessionStorage.clear();
  }
};

// XSS Protection
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// CSRF Token generation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Password strength validation
export const validatePassword = (password: string): { 
  valid: boolean; 
  score: number; 
  feedback: string[] 
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Kamida 8 ta belgi bo\'lishi kerak');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Kichik harflar bo\'lishi kerak');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Katta harflar bo\'lishi kerak');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Raqamlar bo\'lishi kerak');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Maxsus belgilar bo\'lishi kerak');

  return {
    valid: score >= 4,
    score,
    feedback
  };
};

// Audit logging
export const auditLogger = {
  log: (action: string, details: any = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // In production, send to secure logging service
    console.log('AUDIT:', logEntry);
  }
};

// Security headers validation
export const validateSecurityHeaders = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const headers = response.headers;
    
    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection'
    ];
    
    return requiredHeaders.every(header => headers.has(header));
  } catch {
    return false;
  }
};
