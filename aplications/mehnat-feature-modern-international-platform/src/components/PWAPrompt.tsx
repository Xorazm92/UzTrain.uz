import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, X, Smartphone, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function PWAPrompt() {
  const { t } = useTranslation();
  const { 
    isInstallable, 
    isInstalled, 
    isOnline, 
    isUpdateAvailable, 
    installApp, 
    updateApp,
    requestNotificationPermission 
  } = usePWA();
  
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show install prompt after 30 seconds if installable and not dismissed
    if (isInstallable && !isInstalled && !dismissed) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, dismissed]);

  useEffect(() => {
    if (isUpdateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [isUpdateAvailable]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast.success('App installed successfully!');
      setShowInstallPrompt(false);
      
      // Request notification permission after install
      const notificationGranted = await requestNotificationPermission();
      if (notificationGranted) {
        toast.success('Notifications enabled!');
      }
    } else {
      toast.error('Failed to install app');
    }
  };

  const handleUpdate = () => {
    updateApp();
    setShowUpdatePrompt(false);
    toast.success('App is updating...');
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDismissed(true);
    // Remember dismissal for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if user previously dismissed the prompt
  useEffect(() => {
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    if (dismissedTime) {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if (parseInt(dismissedTime) > sevenDaysAgo) {
        setDismissed(true);
      }
    }
  }, []);

  return (
    <>
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium">
          <div className="flex items-center justify-center space-x-2">
            <WifiOff className="h-4 w-4" />
            <span>You are currently offline. Some features may be limited.</span>
          </div>
        </div>
      )}

      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
          <Card className="border-primary shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Install NBT</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Install our app for a better experience with offline access and notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex space-x-2">
                <Button onClick={handleInstall} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Install App
                </Button>
                <Button variant="outline" onClick={handleDismiss}>
                  Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
          <Card className="border-blue-500 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">Update Available</CardTitle>
                  <Badge variant="secondary" className="text-xs">New</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUpdatePrompt(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                A new version of NBT is available with improvements and bug fixes.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex space-x-2">
                <Button onClick={handleUpdate} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Now
                </Button>
                <Button variant="outline" onClick={() => setShowUpdatePrompt(false)}>
                  Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Connection Status Indicator */}
      <div className="fixed bottom-4 left-4 z-30">
        <Badge 
          variant={isOnline ? "default" : "destructive"} 
          className="flex items-center space-x-1"
        >
          {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          <span className="text-xs">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </Badge>
      </div>
    </>
  );
}
