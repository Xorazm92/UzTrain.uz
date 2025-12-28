import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { materialsAPI } from '../../api/materials';

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

interface MaterialsState {
  materials: Material[];
  bookmarkedMaterials: Material[];
  recentMaterials: Material[];
  searchResults: Material[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    category: string | null;
    type: string | null;
    sortBy: 'date' | 'title' | 'views' | 'downloads';
    sortOrder: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

const initialState: MaterialsState = {
  materials: [],
  bookmarkedMaterials: [],
  recentMaterials: [],
  searchResults: [],
  isLoading: false,
  isSearching: false,
  error: null,
  searchQuery: '',
  filters: {
    category: null,
    type: null,
    sortBy: 'date',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true,
  },
};

// Async thunks
export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials',
  async ({ categoryId, page = 1, limit = 20 }: { categoryId?: string; page?: number; limit?: number }) => {
    const response = await materialsAPI.getMaterials({ categoryId, page, limit });
    return response;
  }
);

export const searchMaterials = createAsyncThunk(
  'materials/searchMaterials',
  async ({ query, filters }: { query: string; filters?: any }) => {
    const response = await materialsAPI.searchMaterials(query, filters);
    return response;
  }
);

export const fetchBookmarkedMaterials = createAsyncThunk(
  'materials/fetchBookmarkedMaterials',
  async () => {
    const response = await materialsAPI.getBookmarkedMaterials();
    return response;
  }
);

export const toggleBookmark = createAsyncThunk(
  'materials/toggleBookmark',
  async (materialId: string) => {
    const response = await materialsAPI.toggleBookmark(materialId);
    return { materialId, isBookmarked: response.isBookmarked };
  }
);

export const updateProgress = createAsyncThunk(
  'materials/updateProgress',
  async ({ materialId, progress }: { materialId: string; progress: number }) => {
    const response = await materialsAPI.updateProgress(materialId, progress);
    return { materialId, progress };
  }
);

export const incrementViews = createAsyncThunk(
  'materials/incrementViews',
  async (materialId: string) => {
    await materialsAPI.incrementViews(materialId);
    return materialId;
  }
);

const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Materials
      .addCase(fetchMaterials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg.page === 1) {
          state.materials = action.payload.materials;
        } else {
          state.materials.push(...action.payload.materials);
        }
        state.pagination = {
          ...state.pagination,
          page: action.payload.page,
          total: action.payload.total,
          hasMore: action.payload.hasMore,
        };
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch materials';
      })
      
      // Search Materials
      .addCase(searchMaterials.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchMaterials.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.materials;
      })
      .addCase(searchMaterials.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.error.message || 'Search failed';
      })
      
      // Fetch Bookmarked Materials
      .addCase(fetchBookmarkedMaterials.fulfilled, (state, action) => {
        state.bookmarkedMaterials = action.payload;
      })
      
      // Toggle Bookmark
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        const { materialId, isBookmarked } = action.payload;
        
        // Update in materials array
        const material = state.materials.find(m => m.id === materialId);
        if (material) {
          material.isBookmarked = isBookmarked;
        }
        
        // Update in search results
        const searchMaterial = state.searchResults.find(m => m.id === materialId);
        if (searchMaterial) {
          searchMaterial.isBookmarked = isBookmarked;
        }
        
        // Update bookmarked materials
        if (isBookmarked) {
          if (material && !state.bookmarkedMaterials.find(m => m.id === materialId)) {
            state.bookmarkedMaterials.push(material);
          }
        } else {
          state.bookmarkedMaterials = state.bookmarkedMaterials.filter(m => m.id !== materialId);
        }
      })
      
      // Update Progress
      .addCase(updateProgress.fulfilled, (state, action) => {
        const { materialId, progress } = action.payload;
        
        const material = state.materials.find(m => m.id === materialId);
        if (material) {
          material.progress = progress;
        }
        
        const bookmarkedMaterial = state.bookmarkedMaterials.find(m => m.id === materialId);
        if (bookmarkedMaterial) {
          bookmarkedMaterial.progress = progress;
        }
      })
      
      // Increment Views
      .addCase(incrementViews.fulfilled, (state, action) => {
        const materialId = action.payload;
        const material = state.materials.find(m => m.id === materialId);
        if (material) {
          material.views += 1;
        }
      });
  },
});

export const { 
  clearError, 
  setSearchQuery, 
  setFilters, 
  clearSearchResults, 
  resetPagination 
} = materialsSlice.actions;

export default materialsSlice.reducer;
