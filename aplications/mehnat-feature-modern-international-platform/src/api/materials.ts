import { apiClient } from './client';

export interface Material {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  type: 'pdf' | 'ppt' | 'doc' | 'video' | 'image';
  fileUrl: string;
  thumbnailUrl?: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isBookmarked: boolean;
  progress: number; // 0-100
  views: number;
  downloads: number;
}

export interface MaterialsResponse {
  materials: Material[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface SearchMaterialsResponse {
  materials: Material[];
  total: number;
  query: string;
  filters: any;
}

// Mock materials data
const MOCK_MATERIALS: Material[] = [
  {
    id: '1',
    title: 'Temir yo\'l xavfsizligi qoidalari',
    description: 'Temir yo\'l transportida xavfsizlik choralari va qoidalar haqida to\'liq ma\'lumot',
    categoryId: '2',
    type: 'pdf',
    fileUrl: '/files/xavfsizlik-qoidalari.pdf',
    thumbnailUrl: '/thumbnails/pdf-thumb.png',
    size: 2048000,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    tags: ['xavfsizlik', 'qoidalar', 'transport'],
    isBookmarked: false,
    progress: 0,
    views: 245,
    downloads: 89
  },
  {
    id: '2',
    title: 'Lokomotiv boshqaruv asoslari',
    description: 'Lokomotiv boshqarish texnikasi va asosiy tamoyillar',
    categoryId: '5',
    type: 'ppt',
    fileUrl: '/files/lokomotiv-boshqaruv.pptx',
    thumbnailUrl: '/thumbnails/ppt-thumb.png',
    size: 5120000,
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z',
    tags: ['lokomotiv', 'boshqaruv', 'texnika'],
    isBookmarked: true,
    progress: 45,
    views: 189,
    downloads: 67
  },
  {
    id: '3',
    title: 'Temir yo\'l signalizatsiya tizimi',
    description: 'Zamonaviy signalizatsiya tizimlari va ularning ishlash tamoyillari',
    categoryId: '1',
    type: 'pdf',
    fileUrl: '/files/signalizatsiya-tizimi.pdf',
    thumbnailUrl: '/thumbnails/pdf-thumb.png',
    size: 3072000,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    tags: ['signalizatsiya', 'tizim', 'texnologiya'],
    isBookmarked: false,
    progress: 0,
    views: 156,
    downloads: 43
  },
  {
    id: '4',
    title: 'Yo\'lovchi xizmati standartlari',
    description: 'Yo\'lovchi transportida xizmat ko\'rsatish standartlari va talablari',
    categoryId: '2',
    type: 'doc',
    fileUrl: '/files/yolovchi-xizmati.docx',
    thumbnailUrl: '/thumbnails/doc-thumb.png',
    size: 1536000,
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    tags: ['yolovchi', 'xizmat', 'standart'],
    isBookmarked: true,
    progress: 78,
    views: 203,
    downloads: 91
  },
  {
    id: '5',
    title: 'Temir yo\'l infratuzilmasi',
    description: 'Temir yo\'l infratuzilmasining tuzilishi va ta\'mirlash ishlari',
    categoryId: '6',
    type: 'pdf',
    fileUrl: '/files/infratuzilma.pdf',
    thumbnailUrl: '/thumbnails/pdf-thumb.png',
    size: 4096000,
    createdAt: '2024-01-11T11:20:00Z',
    updatedAt: '2024-01-11T11:20:00Z',
    tags: ['infratuzilma', 'tamirlash', 'qurilish'],
    isBookmarked: false,
    progress: 23,
    views: 134,
    downloads: 56
  }
];

export const materialsAPI = {
  async getMaterials({
    categoryId,
    page = 1,
    limit = 20,
    sortBy = 'date',
    sortOrder = 'desc',
    type,
  }: {
    categoryId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    type?: string;
  }): Promise<MaterialsResponse> {
    try {
      const params: any = { page, limit, sortBy, sortOrder };

      if (categoryId) params.categoryId = categoryId;
      if (type) params.type = type;

      const response = await apiClient.get<MaterialsResponse>('/materials', { params });
      return response.data;
    } catch (error) {
      // Fallback to mock data
      let filteredMaterials = [...MOCK_MATERIALS];

      if (categoryId) {
        filteredMaterials = filteredMaterials.filter(m => m.categoryId === categoryId);
      }

      if (type) {
        filteredMaterials = filteredMaterials.filter(m => m.type === type);
      }

      // Sort materials
      filteredMaterials.sort((a, b) => {
        if (sortBy === 'title') {
          return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
        } else if (sortBy === 'views') {
          return sortOrder === 'asc' ? a.views - b.views : b.views - a.views;
        } else if (sortBy === 'downloads') {
          return sortOrder === 'asc' ? a.downloads - b.downloads : b.downloads - a.downloads;
        } else {
          // Default: sort by date
          return sortOrder === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMaterials = filteredMaterials.slice(startIndex, endIndex);

      return {
        materials: paginatedMaterials,
        page,
        limit,
        total: filteredMaterials.length,
        hasMore: endIndex < filteredMaterials.length
      };
    }
  },

  async getMaterial(id: string): Promise<Material> {
    try {
      const response = await apiClient.get<Material>(`/materials/${id}`);
      return response.data;
    } catch (error) {
      // Fallback to mock data
      const material = MOCK_MATERIALS.find(m => m.id === id);
      if (!material) {
        throw new Error('Material not found');
      }
      return material;
    }
  },

  async searchMaterials(
    query: string,
    filters?: {
      categoryId?: string;
      type?: string;
      tags?: string[];
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<SearchMaterialsResponse> {
    try {
      const response = await apiClient.post<SearchMaterialsResponse>('/materials/search', {
        query,
        filters,
      });
      return response.data;
    } catch (error) {
      // Fallback search in mock data
      let filteredMaterials = MOCK_MATERIALS.filter(material =>
        material.title.toLowerCase().includes(query.toLowerCase()) ||
        material.description.toLowerCase().includes(query.toLowerCase()) ||
        material.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      if (filters?.categoryId) {
        filteredMaterials = filteredMaterials.filter(m => m.categoryId === filters.categoryId);
      }

      if (filters?.type) {
        filteredMaterials = filteredMaterials.filter(m => m.type === filters.type);
      }

      if (filters?.tags && filters.tags.length > 0) {
        filteredMaterials = filteredMaterials.filter(m =>
          filters.tags!.some(tag => m.tags.includes(tag))
        );
      }

      return {
        materials: filteredMaterials,
        total: filteredMaterials.length,
        query,
        filters: filters || {}
      };
    }
  },

  async getRecentMaterials(limit = 10): Promise<Material[]> {
    try {
      const response = await apiClient.get<Material[]>('/materials/recent', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      // Return most recent materials from mock data
      return MOCK_MATERIALS
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    }
  },

  async getPopularMaterials(limit = 10): Promise<Material[]> {
    try {
      const response = await apiClient.get<Material[]>('/materials/popular', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      // Return most viewed materials from mock data
      return MOCK_MATERIALS
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    }
  },

  async getBookmarkedMaterials(): Promise<Material[]> {
    try {
      const response = await apiClient.get<Material[]>('/materials/bookmarked');
      return response.data;
    } catch (error) {
      // Return bookmarked materials from mock data
      return MOCK_MATERIALS.filter(m => m.isBookmarked);
    }
  },

  async toggleBookmark(materialId: string): Promise<{ isBookmarked: boolean }> {
    try {
      const response = await apiClient.post(`/materials/${materialId}/bookmark`);
      return response.data;
    } catch (error) {
      // Mock bookmark toggle
      const material = MOCK_MATERIALS.find(m => m.id === materialId);
      if (material) {
        material.isBookmarked = !material.isBookmarked;
        return { isBookmarked: material.isBookmarked };
      }
      throw new Error('Material not found');
    }
  },

  async updateProgress(materialId: string, progress: number): Promise<{ progress: number }> {
    try {
      const response = await apiClient.patch(`/materials/${materialId}/progress`, {
        progress,
      });
      return response.data;
    } catch (error) {
      // Mock progress update
      const material = MOCK_MATERIALS.find(m => m.id === materialId);
      if (material) {
        material.progress = progress;
        return { progress };
      }
      throw new Error('Material not found');
    }
  },

  async incrementViews(materialId: string): Promise<void> {
    try {
      await apiClient.post(`/materials/${materialId}/view`);
    } catch (error) {
      // Mock view increment
      const material = MOCK_MATERIALS.find(m => m.id === materialId);
      if (material) {
        material.views += 1;
      }
    }
  },

  async incrementDownloads(materialId: string): Promise<void> {
    try {
      await apiClient.post(`/materials/${materialId}/download`);
    } catch (error) {
      // Mock download increment
      const material = MOCK_MATERIALS.find(m => m.id === materialId);
      if (material) {
        material.downloads += 1;
      }
    }
  },

  async getMaterialsByTag(tag: string, limit = 20): Promise<Material[]> {
    const response = await apiClient.get<Material[]>('/materials/by-tag', {
      params: { tag, limit },
    });
    return response.data;
  },

  async getRelatedMaterials(materialId: string, limit = 5): Promise<Material[]> {
    const response = await apiClient.get<Material[]>(`/materials/${materialId}/related`, {
      params: { limit },
    });
    return response.data;
  },

  async reportMaterial(materialId: string, reason: string, description?: string): Promise<void> {
    await apiClient.post(`/materials/${materialId}/report`, {
      reason,
      description,
    });
  },

  async rateMaterial(materialId: string, rating: number, review?: string): Promise<void> {
    await apiClient.post(`/materials/${materialId}/rate`, {
      rating,
      review,
    });
  },
};
