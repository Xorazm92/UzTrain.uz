import { apiClient } from './client';
import { NotificationItem } from '../store/slices/notificationSlice';

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
  total: number;
  page: number;
  hasMore: boolean;
}

export const notificationAPI = {
  async registerPushToken(token: string): Promise<void> {
    await apiClient.post('/notifications/register-token', { token });
  },

  async getNotifications(page = 1, limit = 20): Promise<NotificationsResponse> {
    const response = await apiClient.get<NotificationsResponse>('/notifications', {
      params: { page, limit },
    });
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/read-all');
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  },

  async updateSettings(settings: any): Promise<void> {
    await apiClient.patch('/notifications/settings', settings);
  },

  async getSettings(): Promise<any> {
    const response = await apiClient.get('/notifications/settings');
    return response.data;
  },
};
