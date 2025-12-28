import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to monitoring service if available
    this.setState({ error, errorInfo });

    // Report to error tracking service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-900/20 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl font-semibold text-red-600 dark:text-red-400">
                Xatolik yuz berdi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Dasturda kutilmagan xatolik yuz berdi. Iltimos, sahifani yangilang yoki bosh sahifaga qayting.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="p-3 bg-muted rounded-md text-xs">
                  <summary className="cursor-pointer font-medium">
                    Xatolik tafsilotlari (development)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap text-xs">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={this.handleReset}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Qayta urinib ko'rish
                </Button>
                
                <Button 
                  onClick={this.handleReload}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sahifani yangilash
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  className="w-full"
                  variant="ghost"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Bosh sahifaga qaytish
                </Button>
              </div>

              <div className="pt-4 border-t text-center">
                <p className="text-xs text-muted-foreground">
                  Agar muammo davom etsa, administrator bilan bog'laning.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;