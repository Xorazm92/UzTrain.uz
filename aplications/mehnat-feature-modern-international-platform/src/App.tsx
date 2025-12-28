import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ToastContainer } from "@/components/Toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PWAPrompt } from "@/components/PWAPrompt";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { GlobalNotifications } from "@/components/GlobalNotifications";
import { AccessibilityHelper } from "@/components/AccessibilityHelper";
import { ResponsiveDesignHelper } from "@/components/ResponsiveDesignHelper";
import "./i18n";

// Lazy load pages for better performance

const RailwayIndex = lazy(() => import("./pages/RailwayIndex"));
const VideoMaterials = lazy(() => import("./pages/VideoMaterials"));
const Banners = lazy(() => import("./pages/Banners"));
const Laws = lazy(() => import("./pages/Laws"));
const Rules = lazy(() => import("./pages/Rules"));
const Slides = lazy(() => import("./pages/Slides"));
const RailwayDocuments = lazy(() => import("./pages/RailwayDocuments"));
const JobManuals = lazy(() => import("./pages/JobManuals"));

const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(module => ({ default: module.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminVideoMaterials = lazy(() => import("./pages/admin/VideoMaterials"));
const AdminNormativDocuments = lazy(() => import("./pages/admin/NormativDocuments"));
const AdminSlides = lazy(() => import("./pages/admin/Slides"));
const AdminBanners = lazy(() => import("./pages/admin/Banners"));
const AdminJobManuals = lazy(() => import("./pages/admin/JobManuals"));
const AdminRailwayDocuments = lazy(() => import("./pages/admin/RailwayDocuments"));
const AdminLaws = lazy(() => import("./pages/admin/Laws"));
const AdminDecisions = lazy(() => import("./pages/admin/Decisions"));
const AdminRules = lazy(() => import("./pages/admin/Rules"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const BucketSetup = lazy(() => import("./pages/admin/BucketSetup"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <ThemeProvider defaultTheme="system" storageKey="nbt-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSkeleton type="hero" />}>
              <Routes>
                <Route path="/" element={<RailwayIndex />} />
                <Route path="/qonunlar" element={<Laws />} />
                <Route path="/qoidalar" element={<Rules />} />
                <Route path="/video-materiallar" element={<VideoMaterials />} />
                <Route path="/slaydlar" element={<Slides />} />
                <Route path="/temir-yol" element={<RailwayDocuments />} />
                <Route path="/bannerlar" element={<Banners />} />
                <Route path="/kasb-yoriqnomalari" element={<JobManuals />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="video-materiallar" element={<AdminVideoMaterials />} />
                  <Route path="normativ-hujjatlar" element={<AdminNormativDocuments />} />
                  <Route path="slaydlar" element={<AdminSlides />} />
                  <Route path="bannerlar" element={<AdminBanners />} />
                  <Route path="kasb-yoriqnomalari" element={<AdminJobManuals />} />
                  <Route path="temir-yol-hujjatlari" element={<AdminRailwayDocuments />} />
                  <Route path="qonunlar" element={<AdminLaws />} />
                  <Route path="qarorlar" element={<AdminDecisions />} />
                  <Route path="qoidalar" element={<AdminRules />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="bucket-setup" element={<BucketSetup />} />
                </Route>

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          {/* <PWAPrompt /> */}
          <GlobalNotifications />
          <AccessibilityHelper />
          <ResponsiveDesignHelper />
          <ToastContainer />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
