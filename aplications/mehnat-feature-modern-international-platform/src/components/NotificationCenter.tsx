import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Bell,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Safety Regulation',
    message: 'A new industrial safety regulation has been published and requires immediate attention.',
    type: 'warning',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    actionUrl: '/qonunlar',
    actionText: 'View Regulation'
  },
  {
    id: '2',
    title: 'Training Video Added',
    message: 'New fire safety training video is now available in the video materials section.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    actionUrl: '/video-materiallar',
    actionText: 'Watch Video'
  },
  {
    id: '3',
    title: 'System Update Complete',
    message: 'The platform has been successfully updated with new features and improvements.',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: '4',
    title: 'Maintenance Scheduled',
    message: 'Scheduled maintenance will occur tomorrow from 2:00 AM to 4:00 AM UTC.',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
];

export function NotificationCenter() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Simulate receiving new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new notification (for demo purposes)
      if (Math.random() > 0.95) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: 'New Update Available',
          message: 'A new safety material has been added to the platform.',
          type: 'info',
          read: false,
          createdAt: new Date(),
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.read ? 'border-primary/20 bg-primary/5' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getIcon(notification.type)}
                        <CardTitle className="text-sm font-medium">
                          {notification.title}
                        </CardTitle>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs mb-2">
                      {notification.message}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </span>
                      {notification.actionUrl && notification.actionText && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to action URL
                            window.location.href = notification.actionUrl!;
                          }}
                        >
                          {notification.actionText}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => {
              setIsOpen(false);
              // Navigate to notification settings
            }}
          >
            <Settings className="h-3 w-3 mr-2" />
            Notification Settings
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
