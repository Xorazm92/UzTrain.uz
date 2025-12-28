import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as FileSystem from 'expo-file-system';
import { downloadAPI } from '../../api/download';

export interface DownloadItem {
  id: string;
  materialId: string;
  title: string;
  fileUrl: string;
  localPath?: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';
  size: number;
  downloadedSize: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

interface DownloadState {
  downloads: DownloadItem[];
  activeDownloads: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DownloadState = {
  downloads: [],
  activeDownloads: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const startDownload = createAsyncThunk(
  'downloads/startDownload',
  async ({ materialId, title, fileUrl, size }: { 
    materialId: string; 
    title: string; 
    fileUrl: string; 
    size: number; 
  }) => {
    const downloadId = `download_${Date.now()}`;
    const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${materialId}`;
    const localPath = `${FileSystem.documentDirectory}downloads/${fileName}`;
    
    // Create download directory if it doesn't exist
    const downloadDir = `${FileSystem.documentDirectory}downloads/`;
    const dirInfo = await FileSystem.getInfoAsync(downloadDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
    }
    
    const downloadItem: DownloadItem = {
      id: downloadId,
      materialId,
      title,
      fileUrl,
      localPath,
      progress: 0,
      status: 'pending',
      size,
      downloadedSize: 0,
      createdAt: new Date().toISOString(),
    };
    
    return downloadItem;
  }
);

export const resumeDownload = createAsyncThunk(
  'downloads/resumeDownload',
  async (downloadId: string, { getState }) => {
    const state = getState() as any;
    const download = state.downloads.downloads.find((d: DownloadItem) => d.id === downloadId);
    
    if (!download) {
      throw new Error('Download not found');
    }
    
    return download;
  }
);

export const pauseDownload = createAsyncThunk(
  'downloads/pauseDownload',
  async (downloadId: string) => {
    // Pause download logic here
    return downloadId;
  }
);

export const cancelDownload = createAsyncThunk(
  'downloads/cancelDownload',
  async (downloadId: string, { getState }) => {
    const state = getState() as any;
    const download = state.downloads.downloads.find((d: DownloadItem) => d.id === downloadId);
    
    if (download && download.localPath) {
      // Delete partial file
      const fileInfo = await FileSystem.getInfoAsync(download.localPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(download.localPath);
      }
    }
    
    return downloadId;
  }
);

export const retryDownload = createAsyncThunk(
  'downloads/retryDownload',
  async (downloadId: string, { getState }) => {
    const state = getState() as any;
    const download = state.downloads.downloads.find((d: DownloadItem) => d.id === downloadId);
    
    if (!download) {
      throw new Error('Download not found');
    }
    
    return download;
  }
);

export const loadDownloads = createAsyncThunk(
  'downloads/loadDownloads',
  async () => {
    // Load downloads from AsyncStorage or local database
    const downloads = await downloadAPI.getDownloads();
    return downloads;
  }
);

export const deleteDownload = createAsyncThunk(
  'downloads/deleteDownload',
  async (downloadId: string, { getState }) => {
    const state = getState() as any;
    const download = state.downloads.downloads.find((d: DownloadItem) => d.id === downloadId);
    
    if (download && download.localPath) {
      // Delete file from device
      const fileInfo = await FileSystem.getInfoAsync(download.localPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(download.localPath);
      }
    }
    
    // Remove from local database
    await downloadAPI.deleteDownload(downloadId);
    
    return downloadId;
  }
);

const downloadSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    updateDownloadProgress: (state, action: PayloadAction<{ 
      downloadId: string; 
      progress: number; 
      downloadedSize: number; 
    }>) => {
      const download = state.downloads.find(d => d.id === action.payload.downloadId);
      if (download) {
        download.progress = action.payload.progress;
        download.downloadedSize = action.payload.downloadedSize;
        download.status = 'downloading';
      }
    },
    
    completeDownload: (state, action: PayloadAction<{ downloadId: string; localPath: string }>) => {
      const download = state.downloads.find(d => d.id === action.payload.downloadId);
      if (download) {
        download.status = 'completed';
        download.progress = 100;
        download.localPath = action.payload.localPath;
        download.completedAt = new Date().toISOString();
        download.downloadedSize = download.size;
      }
      state.activeDownloads = state.activeDownloads.filter(id => id !== action.payload.downloadId);
    },
    
    failDownload: (state, action: PayloadAction<{ downloadId: string; error: string }>) => {
      const download = state.downloads.find(d => d.id === action.payload.downloadId);
      if (download) {
        download.status = 'failed';
        download.error = action.payload.error;
      }
      state.activeDownloads = state.activeDownloads.filter(id => id !== action.payload.downloadId);
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Start Download
      .addCase(startDownload.fulfilled, (state, action) => {
        state.downloads.unshift(action.payload);
        state.activeDownloads.push(action.payload.id);
      })
      
      // Resume Download
      .addCase(resumeDownload.fulfilled, (state, action) => {
        const download = state.downloads.find(d => d.id === action.payload.id);
        if (download) {
          download.status = 'downloading';
          if (!state.activeDownloads.includes(download.id)) {
            state.activeDownloads.push(download.id);
          }
        }
      })
      
      // Pause Download
      .addCase(pauseDownload.fulfilled, (state, action) => {
        const download = state.downloads.find(d => d.id === action.payload);
        if (download) {
          download.status = 'paused';
        }
        state.activeDownloads = state.activeDownloads.filter(id => id !== action.payload);
      })
      
      // Cancel Download
      .addCase(cancelDownload.fulfilled, (state, action) => {
        state.downloads = state.downloads.filter(d => d.id !== action.payload);
        state.activeDownloads = state.activeDownloads.filter(id => id !== action.payload);
      })
      
      // Retry Download
      .addCase(retryDownload.fulfilled, (state, action) => {
        const download = state.downloads.find(d => d.id === action.payload.id);
        if (download) {
          download.status = 'pending';
          download.error = undefined;
          download.progress = 0;
          download.downloadedSize = 0;
        }
      })
      
      // Load Downloads
      .addCase(loadDownloads.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadDownloads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.downloads = action.payload;
      })
      .addCase(loadDownloads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load downloads';
      })
      
      // Delete Download
      .addCase(deleteDownload.fulfilled, (state, action) => {
        state.downloads = state.downloads.filter(d => d.id !== action.payload);
        state.activeDownloads = state.activeDownloads.filter(id => id !== action.payload);
      });
  },
});

export const { 
  updateDownloadProgress, 
  completeDownload, 
  failDownload, 
  clearError 
} = downloadSlice.actions;

export default downloadSlice.reducer;
