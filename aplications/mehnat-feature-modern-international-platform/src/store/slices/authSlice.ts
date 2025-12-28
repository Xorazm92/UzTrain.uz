import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../../api/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authAPI.login(email, password);
    
    // Store tokens securely
    await SecureStore.setItemAsync('accessToken', response.token);
    await SecureStore.setItemAsync('refreshToken', response.refreshToken);
    
    return response;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const response = await authAPI.register(email, password, name);
    
    // Store tokens securely
    await SecureStore.setItemAsync('accessToken', response.token);
    await SecureStore.setItemAsync('refreshToken', response.refreshToken);
    
    return response;
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async () => {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await authAPI.refreshToken(refreshToken);
    
    // Update stored tokens
    await SecureStore.setItemAsync('accessToken', response.token);
    await SecureStore.setItemAsync('refreshToken', response.refreshToken);
    
    return response;
  }
);

export const loadStoredAuth = createAsyncThunk(
  'auth/loadStored',
  async () => {
    const token = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    
    if (!token) throw new Error('No stored token');
    
    // Verify token and get user info
    const user = await authAPI.getProfile(token);
    
    return { token, refreshToken, user };
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    // Clear stored tokens
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      
      // Load Stored Auth
      .addCase(loadStoredAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loadStoredAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
