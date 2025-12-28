import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { smartDB } from '@/lib/smartDB';

interface FeaturedItem {
  id: number;
  title: string;
  description?: string;
  file_path?: string;
  video_url?: string;
  type: 'banner' | 'video' | 'slide';
}

export function FeaturedCarousel() {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedContent();
  }, []);

  const fetchFeaturedContent = async () => {
    try {
      setLoading(true);

      // Fetch featured banners using Smart DB
      const { data: banners, error: bannersError } = await smartDB.select('banner');
      console.log('Fetched banners:', banners);

      // Fetch latest videos using Smart DB
      const { data: videos, error: videosError } = await smartDB.select('video_materiallar');
      console.log('Fetched videos:', videos);

      const items: FeaturedItem[] = [];

      // Add banners (limit to 3 most recent)
      if (banners && !bannersError) {
        const sortedBanners = banners
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3);
        items.push(...sortedBanners.map(item => ({
          ...item,
          type: 'banner' as const
        })));
      }

      // Add videos (limit to 2 most recent)
      if (videos && !videosError) {
        const sortedVideos = videos
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 2);
        items.push(...sortedVideos.map(item => ({
          ...item,
          type: 'video' as const
        })));
      }

      console.log('Featured items:', items);
      setFeaturedItems(items);
    } catch (error) {
      console.error('Error fetching featured content:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  useEffect(() => {
    if (featuredItems.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredItems.length]);

  if (loading) {
    return (
      <div className="relative w-full h-64 md:h-80 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg animate-pulse" />
    );
  }

  if (featuredItems.length === 0) {
    return (
      <Card className="w-full h-64 md:h-80">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Hozircha taniqli materiallar yo'q</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentItem = featuredItems[currentIndex];

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg group">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {featuredItems.map((item, index) => (
          <div key={item.id} className="w-full flex-shrink-0 relative">
            <Card className="w-full h-full border-0">
              <CardContent className="relative h-full p-0 bg-gradient-to-br from-primary to-primary/80 text-white">
                {/* Background Image for Banners */}
                {item.type === 'banner' && item.file_path && (
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${item.file_path})`,
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-12">
                  <div className="max-w-2xl">
                    <div className="flex items-center space-x-2 mb-4">
                      {item.type === 'video' ? (
                        <Play className="h-6 w-6" />
                      ) : (
                        <FileText className="h-6 w-6" />
                      )}
                      <span className="text-sm font-medium uppercase tracking-wider opacity-90">
                        {item.type === 'banner' ? 'Asosiy' : item.type === 'video' ? 'Video' : 'Material'}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold mb-4 line-clamp-2">
                      {item.title}
                    </h2>
                    {item.description && (
                      <p className="text-lg opacity-90 line-clamp-3 mb-6">
                        {item.description}
                      </p>
                    )}
                    <Button 
                      variant="secondary" 
                      size="lg"
                      onClick={() => {
                        if (item.video_url) window.open(item.video_url, '_blank');
                        else if (item.file_path) window.open(item.file_path, '_blank');
                      }}
                    >
                      {item.type === 'video' ? 'Video ko\'rish' : 'Batafsil'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {featuredItems.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {featuredItems.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}