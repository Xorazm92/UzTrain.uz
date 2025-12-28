import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import categoriesSlice from './slices/categoriesSlice';
import materialsSlice from './slices/materialsSlice';
import downloadSlice from './slices/downloadSlice';
import themeSlice from './slices/themeSlice';
import notificationSlice from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    categories: categoriesSlice,
    materials: materialsSlice,
    downloads: downloadSlice,
    theme: themeSlice,
    notifications: notificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
