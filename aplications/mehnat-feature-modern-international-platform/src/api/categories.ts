import { apiClient } from './client';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  color: string;
  path: string;
}

// Web projectdagi kategoriyalar (real data)
const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Qonunlar',
    description: 'Temir yo\'l transporti qonunlari',
    icon: 'book',
    count: 58,
    color: '#3b82f6',
    path: '/qonunlar'
  },
  {
    id: '2',
    name: 'Qoidalar',
    description: 'Temir yo\'l qoidalari va tartib-qoidalar',
    icon: 'shield-checkmark',
    count: 20,
    color: '#10b981',
    path: '/qoidalar'
  },
  {
    id: '3',
    name: 'Video Materiallar',
    description: 'Ta\'limiy video darslar',
    icon: 'play-circle',
    count: 0,
    color: '#f59e0b',
    path: '/video-materiallar'
  },
  {
    id: '4',
    name: 'Slaydlar',
    description: 'Prezentatsiya va slaydlar',
    icon: 'document-text',
    count: 41,
    color: '#8b5cf6',
    path: '/slaydlar'
  },
  {
    id: '5',
    name: 'Kasb Yo\'riqnomalari',
    description: 'Kasb-hunar yo\'riqnomalari',
    icon: 'briefcase',
    count: 141,
    color: '#ef4444',
    path: '/kasb-yoriqnomalari'
  },
  {
    id: '6',
    name: 'Temir Yo\'l Hujjatlari',
    description: 'Rasmiy hujjatlar va me\'yoriy aktlar',
    icon: 'document',
    count: 17,
    color: '#06b6d4',
    path: '/temir-yol-hujjatlari'
  },
  {
    id: '7',
    name: 'Bannerlar',
    description: 'Targ\'ibot va ma\'lumot bannerlari',
    icon: 'image',
    count: 13,
    color: '#84cc16',
    path: '/bannerlar'
  }
];

export const categoriesAPI = {
  async getCategories(): Promise<Category[]> {
    try {
      // Try to get from web API
      const response = await apiClient.get<Category[]>('/categories');
      return response.data;
    } catch (error) {
      // Fallback to mock data
      console.log('Using mock categories data');
      return MOCK_CATEGORIES;
    }
  },

  async getCategory(id: string): Promise<Category> {
    try {
      const response = await apiClient.get<Category>(`/categories/${id}`);
      return response.data;
    } catch (error) {
      // Fallback to mock data
      const category = MOCK_CATEGORIES.find(cat => cat.id === id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    }
  },

  async getCategoryStats(id: string): Promise<{
    totalMaterials: number;
    totalViews: number;
    totalDownloads: number;
    recentMaterials: number;
  }> {
    try {
      const response = await apiClient.get(`/categories/${id}/stats`);
      return response.data;
    } catch (error) {
      // Mock stats
      const category = MOCK_CATEGORIES.find(cat => cat.id === id);
      return {
        totalMaterials: category?.count || 0,
        totalViews: Math.floor(Math.random() * 1000),
        totalDownloads: Math.floor(Math.random() * 500),
        recentMaterials: Math.floor(Math.random() * 10),
      };
    }
  },

  async searchCategories(query: string): Promise<Category[]> {
    try {
      const response = await apiClient.get<Category[]>('/categories/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      // Fallback search in mock data
      return MOCK_CATEGORIES.filter(cat =>
        cat.name.toLowerCase().includes(query.toLowerCase()) ||
        cat.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  },
};
