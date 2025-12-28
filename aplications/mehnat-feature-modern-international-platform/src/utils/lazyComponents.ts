import { lazy } from 'react';

// Lazy load heavy components for better performance
export const LazyAnalytics = lazy(() => import('@/components/Analytics'));
export const LazyVideoPlayer = lazy(() => import('@/components/VideoPlayer'));
export const LazyPDFViewer = lazy(() => import('@/components/PDFViewer'));
export const LazyChart = lazy(() => import('@/components/Chart'));

// Admin components
export const LazyDashboard = lazy(() => import('@/pages/admin/Dashboard'));
export const LazyUserManagement = lazy(() => import('@/pages/admin/UserManagement'));

// Heavy pages
export const LazyVideoMateriallar = lazy(() => import('@/pages/VideoMateriallar'));
export const LazySlaydlar = lazy(() => import('@/pages/Slaydlar'));
export const LazyQonunlar = lazy(() => import('@/pages/Qonunlar'));

// Utility function for lazy loading with error boundary
export const withLazyLoading = (Component: React.LazyExoticComponent<any>) => {
  return (props: any) => (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <Component {...props} />
    </React.Suspense>
  );
};
