import { toast } from 'sonner';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  DATABASE = 'DATABASE',
  STORAGE = 'STORAGE',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  PERMISSION = 'PERMISSION',
  FILE_UPLOAD = 'FILE_UPLOAD',
  UNKNOWN = 'UNKNOWN'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Custom error class
export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType = ErrorType.UNKNOWN,
    public severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    public originalError?: any,
    public context?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: Array<{
    timestamp: string;
    error: AppError;
    context?: any;
  }> = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Handle different types of errors
  handle(error: any, context?: any): void {
    const appError = this.normalizeError(error, context);
    this.logError(appError, context);
    this.showUserNotification(appError);
    
    // Report critical errors
    if (appError.severity === ErrorSeverity.CRITICAL) {
      this.reportCriticalError(appError, context);
    }
  }

  // Normalize different error types to AppError
  private normalizeError(error: any, context?: any): AppError {
    if (error instanceof AppError) {
      return error;
    }

    // Supabase errors
    if (error?.message) {
      const message = error.message.toLowerCase();
      
      if (message.includes('network') || message.includes('cors') || message.includes('fetch')) {
        return new AppError(
          'Internetga ulanishda muammo. Iltimos, ulanishni tekshiring.',
          ErrorType.NETWORK,
          ErrorSeverity.HIGH,
          error,
          context
        );
      }
      
      if (message.includes('row-level security') || message.includes('rls')) {
        return new AppError(
          'Ma\'lumotlar bazasiga kirish ruxsati yo\'q. Local database ishlatiladi.',
          ErrorType.PERMISSION,
          ErrorSeverity.MEDIUM,
          error,
          context
        );
      }
      
      if (message.includes('bucket not found') || message.includes('storage')) {
        return new AppError(
          'Fayl saqlash xizmati mavjud emas. Fayllar local saqlanadi.',
          ErrorType.STORAGE,
          ErrorSeverity.MEDIUM,
          error,
          context
        );
      }
      
      if (message.includes('value too long') || message.includes('character varying')) {
        return new AppError(
          'Fayl hajmi juda katta. Fayl siqiladi va qayta saqlanadi.',
          ErrorType.DATABASE,
          ErrorSeverity.LOW,
          error,
          context
        );
      }
      
      if (message.includes('duplicate') || message.includes('unique')) {
        return new AppError(
          'Bu ma\'lumot allaqachon mavjud.',
          ErrorType.VALIDATION,
          ErrorSeverity.LOW,
          error,
          context
        );
      }
    }

    // File upload errors
    if (error?.name === 'FileError' || context?.operation === 'file_upload') {
      return new AppError(
        error.message || 'Fayl yuklashda xatolik yuz berdi.',
        ErrorType.FILE_UPLOAD,
        ErrorSeverity.MEDIUM,
        error,
        context
      );
    }

    // Generic error
    return new AppError(
      error?.message || 'Noma\'lum xatolik yuz berdi.',
      ErrorType.UNKNOWN,
      ErrorSeverity.MEDIUM,
      error,
      context
    );
  }

  // Log error for debugging
  private logError(error: AppError, context?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error,
      context
    };
    
    this.errorLog.push(logEntry);
    
    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }
    
    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${error.type} Error`);
      console.error('Message:', error.message);
      console.error('Severity:', error.severity);
      console.error('Original:', error.originalError);
      console.error('Context:', context);
      console.groupEnd();
    }
  }

  // Show user-friendly notification
  private showUserNotification(error: AppError): void {
    const duration = this.getNotificationDuration(error.severity);
    
    switch (error.severity) {
      case ErrorSeverity.LOW:
        toast.info(error.message, { duration });
        break;
      case ErrorSeverity.MEDIUM:
        toast.warning(error.message, { duration });
        break;
      case ErrorSeverity.HIGH:
        toast.error(error.message, { duration });
        break;
      case ErrorSeverity.CRITICAL:
        toast.error(error.message, { 
          duration: 10000,
          action: {
            label: 'Qayta urinish',
            onClick: () => window.location.reload()
          }
        });
        break;
    }
  }

  // Get notification duration based on severity
  private getNotificationDuration(severity: ErrorSeverity): number {
    switch (severity) {
      case ErrorSeverity.LOW: return 3000;
      case ErrorSeverity.MEDIUM: return 5000;
      case ErrorSeverity.HIGH: return 7000;
      case ErrorSeverity.CRITICAL: return 10000;
      default: return 5000;
    }
  }

  // Report critical errors (could be sent to monitoring service)
  private reportCriticalError(error: AppError, context?: any): void {
    // In production, this could send to error monitoring service
    console.error('CRITICAL ERROR REPORTED:', {
      error: error.message,
      type: error.type,
      timestamp: new Date().toISOString(),
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }

  // Get error statistics
  getErrorStats(): {
    total: number;
    byType: Record<ErrorType, number>;
    bySeverity: Record<ErrorSeverity, number>;
    recent: Array<{ timestamp: string; message: string; type: ErrorType }>;
  } {
    const byType = {} as Record<ErrorType, number>;
    const bySeverity = {} as Record<ErrorSeverity, number>;
    
    Object.values(ErrorType).forEach(type => byType[type] = 0);
    Object.values(ErrorSeverity).forEach(severity => bySeverity[severity] = 0);
    
    this.errorLog.forEach(entry => {
      byType[entry.error.type]++;
      bySeverity[entry.error.severity]++;
    });
    
    const recent = this.errorLog
      .slice(-10)
      .map(entry => ({
        timestamp: entry.timestamp,
        message: entry.error.message,
        type: entry.error.type
      }));
    
    return {
      total: this.errorLog.length,
      byType,
      bySeverity,
      recent
    };
  }

  // Clear error log
  clearLog(): void {
    this.errorLog = [];
    toast.success('Error log tozalandi');
  }
}

// Global error handler instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions
export const handleError = (error: any, context?: any): void => {
  errorHandler.handle(error, context);
};

export const createError = (
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
): AppError => {
  return new AppError(message, type, severity);
};

// Async operation wrapper with error handling
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context?: any,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    handleError(error, context);
    return fallback;
  }
};

// Retry mechanism for failed operations
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  context?: any
): Promise<T | undefined> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        handleError(error, { ...context, finalAttempt: true, attempts: attempt });
        return undefined;
      }
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
};
