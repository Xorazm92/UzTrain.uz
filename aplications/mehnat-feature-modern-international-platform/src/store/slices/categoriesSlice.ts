import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { categoriesAPI } from '../../api/categories';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  color: string;
  path: string;
}

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await categoriesAPI.getCategories();
    return response;
  }
);

export const refreshCategories = createAsyncThunk(
  'categories/refreshCategories',
  async () => {
    const response = await categoriesAPI.getCategories();
    return response;
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateCategoryCount: (state, action: PayloadAction<{ id: string; count: number }>) => {
      const category = state.categories.find(cat => cat.id === action.payload.id);
      if (category) {
        category.count = action.payload.count;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      
      // Refresh Categories
      .addCase(refreshCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.lastUpdated = Date.now();
      });
  },
});

export const { clearError, updateCategoryCount } = categoriesSlice.actions;
export default categoriesSlice.reducer;
