import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as Notifications from 'expo-notifications';
import { notificationAPI } from '../../api/notifications';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  data?: any;
  type: 'info' | 'success' | 'warning' | 'error' | 'material' | 'download';
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  pushToken: string | null;
  isEnabled: boolean;
  isLoading: boolean;
  error: string | null;
  settings: {
    materials: boolean;
    downloads: boolean;
    system: boolean;
    marketing: boolean;
  };
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  pushToken: null,
  isEnabled: true,
  isLoading: false,
  error: null,
  settings: {
    materials: true,
    downloads: true,
    system: true,
    marketing: false,
  },
};

// Async thunks
export const registerForPushNotifications = createAsyncThunk(
  'notifications/registerForPush',
  async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted for push notifications');
    }
    
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Register token with backend
    await notificationAPI.registerPushToken(token);
    
    return token;
  }
);

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    const response = await notificationAPI.getNotifications(page, limit);
    return response;
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string) => {
    await notificationAPI.markAsRead(notificationId);
    return notificationId;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    await notificationAPI.markAllAsRead();
    return null;
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: string) => {
    await notificationAPI.deleteNotification(notificationId);
    return notificationId;
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'notifications/updateSettings',
  async (settings: Partial<NotificationState['settings']>) => {
    await notificationAPI.updateSettings(settings);
    return settings;
  }
);

export const scheduleLocalNotification = createAsyncThunk(
  'notifications/scheduleLocal',
  async ({ title, body, data, trigger }: {
    title: string;
    body: string;
    data?: any;
    trigger?: Notifications.NotificationTriggerInput;
  }) => {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: trigger || null,
    });
    
    return { id: notificationId, title, body, data };
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'createdAt'>>) => {
      const notification: NotificationItem = {
        ...action.payload,
        id: `notification_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      state.notifications.unshift(notification);
      if (!notification.isRead) {
        state.unreadCount += 1;
      }
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount -= 1;
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    
    setNotificationEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEnabled = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    updateUnreadCount: (state) => {
      state.unreadCount = state.notifications.filter(n => !n.isRead).length;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Register for Push Notifications
      .addCase(registerForPushNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerForPushNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pushToken = action.payload;
        state.isEnabled = true;
      })
      .addCase(registerForPushNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to register for push notifications';
        state.isEnabled = false;
      })
      
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg?.page === 1) {
          state.notifications = action.payload.notifications;
        } else {
          state.notifications.push(...action.payload.notifications);
        }
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      
      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount -= 1;
        }
      })
      
      // Mark All as Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      })
      
      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          state.unreadCount -= 1;
        }
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
      })
      
      // Update Settings
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.settings = { ...state.settings, ...action.payload };
      })
      
      // Schedule Local Notification
      .addCase(scheduleLocalNotification.fulfilled, (state, action) => {
        // Optionally add to local notifications list
      });
  },
});

export const {
  addNotification,
  removeNotification,
  clearAllNotifications,
  setNotificationEnabled,
  clearError,
  updateUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
