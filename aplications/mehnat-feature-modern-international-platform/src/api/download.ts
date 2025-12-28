import { apiClient } from './client';
import { DownloadItem } from '../store/slices/downloadSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const downloadAPI = {
  async getDownloadUrl(materialId: string): Promise<{ url: string; expiresAt: string }> {
    const response = await apiClient.get(`/materials/${materialId}/download-url`);
    return response.data;
  },

  async getDownloads(): Promise<DownloadItem[]> {
    try {
      const downloads = await AsyncStorage.getItem('downloads');
      return downloads ? JSON.parse(downloads) : [];
    } catch (error) {
      console.error('Error loading downloads:', error);
      return [];
    }
  },

  async saveDownload(download: DownloadItem): Promise<void> {
    try {
      const downloads = await this.getDownloads();
      const existingIndex = downloads.findIndex(d => d.id === download.id);
      
      if (existingIndex >= 0) {
        downloads[existingIndex] = download;
      } else {
        downloads.unshift(download);
      }
      
      await AsyncStorage.setItem('downloads', JSON.stringify(downloads));
    } catch (error) {
      console.error('Error saving download:', error);
    }
  },

  async updateDownload(downloadId: string, updates: Partial<DownloadItem>): Promise<void> {
    try {
      const downloads = await this.getDownloads();
      const index = downloads.findIndex(d => d.id === downloadId);
      
      if (index >= 0) {
        downloads[index] = { ...downloads[index], ...updates };
        await AsyncStorage.setItem('downloads', JSON.stringify(downloads));
      }
    } catch (error) {
      console.error('Error updating download:', error);
    }
  },

  async deleteDownload(downloadId: string): Promise<void> {
    try {
      const downloads = await this.getDownloads();
      const filtered = downloads.filter(d => d.id !== downloadId);
      await AsyncStorage.setItem('downloads', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting download:', error);
    }
  },

  async clearAllDownloads(): Promise<void> {
    try {
      await AsyncStorage.removeItem('downloads');
    } catch (error) {
      console.error('Error clearing downloads:', error);
    }
  },

  async getDownloadStats(): Promise<{
    totalDownloads: number;
    completedDownloads: number;
    failedDownloads: number;
    totalSize: number;
  }> {
    try {
      const downloads = await this.getDownloads();
      
      return {
        totalDownloads: downloads.length,
        completedDownloads: downloads.filter(d => d.status === 'completed').length,
        failedDownloads: downloads.filter(d => d.status === 'failed').length,
        totalSize: downloads.reduce((total, d) => total + d.size, 0),
      };
    } catch (error) {
      console.error('Error getting download stats:', error);
      return {
        totalDownloads: 0,
        completedDownloads: 0,
        failedDownloads: 0,
        totalSize: 0,
      };
    }
  },
};
