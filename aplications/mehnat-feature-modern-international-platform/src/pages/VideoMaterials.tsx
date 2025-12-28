import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { MaterialCard } from '@/components/MaterialCard';
import { FilterBar } from '@/components/FilterBar';
import { VideoPlayer } from '@/components/VideoPlayer';
import SEO from '@/components/SEO';
import { Video, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { smartDB } from '@/lib/smartDB';
import { handleError } from '@/lib/errorHandler';

interface VideoMaterial {
  id: number;
  title: string;
  description?: string;
  xavfsizlik_darajasi: string;
  created_at: string;
  video_url?: string;
  file_path?: string;
}

export default function VideoMaterials() {
  const [materials, setMaterials] = useState<VideoMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<VideoMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSafetyLevel, setSelectedSafetyLevel] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoMaterial | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchQuery, selectedSafetyLevel]);

  const fetchMaterials = async () => {
    try {
      const result = await smartDB.select('video_materiallar', '*');

      if (result.error) {
        handleError(result.error, { operation: 'fetch_video_materials' });
        setMaterials([]);
      } else {
        setMaterials(result.data || []);
      }
    } catch (error) {
      handleError(error, { operation: 'fetch_video_materials' });
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = [...materials];

    if (searchQuery) {
      filtered = filtered.filter(material =>
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSafetyLevel) {
      filtered = filtered.filter(material =>
        material.xavfsizlik_darajasi === selectedSafetyLevel
      );
    }

    setFilteredMaterials(filtered);
  };

  const seoData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "SafeDocs Video Materiallar",
    "description": "Temir yo'l xavfsizligi bo'yicha professional video ta'lim materiallari",
    "url": "https://safedocs.uz/video-materiallar",
    "thumbnailUrl": "https://safedocs.uz/icons/icon-512x512.png",
    "uploadDate": new Date().toISOString(),
    "contentUrl": "https://safedocs.uz/video-materiallar",
    "embedUrl": "https://safedocs.uz/video-materiallar",
    "publisher": {
      "@type": "Organization",
      "name": "SafeDocs"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Video Materiallar - SafeDocs | Temir Yo'l Xavfsizligi Video Ta'lim"
        description="Professional xavfsizlik ta'limi uchun video materiallar. Elektr xavfsizligi, yong'in xavfsizligi, sanoat xavfsizligi va temir yo'l harakati xavfsizligi bo'yicha interaktiv video darslar."
        keywords="video materiallar, xavfsizlik video, temir yo'l ta'limi, elektr xavfsizligi video, yong'in xavfsizligi video, sanoat xavfsizligi, video darslar"
        type="video"
        structuredData={seoData}
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Video className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Video Materiallar</h1>
            <p className="text-muted-foreground">Xavfsizlik bo'yicha video darslar</p>
          </div>
        </div>

        {/* Video Player Section */}
        {selectedVideo && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{selectedVideo.title}</h2>
            <VideoPlayer src={selectedVideo.video_url} title={selectedVideo.title} />
            {selectedVideo.description && (
              <p className="mt-4 text-muted-foreground">{selectedVideo.description}</p>
            )}
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar
          onSearch={setSearchQuery}
          onFilterBySafety={setSelectedSafetyLevel}
          onClearFilters={() => {
            setSearchQuery('');
            setSelectedSafetyLevel(null);
          }}
          searchQuery={searchQuery}
          selectedSafetyLevel={selectedSafetyLevel}
          totalCount={materials.length}
          filteredCount={filteredMaterials.length}
        />

        {/* Materials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                id={material.id}
                title={material.title}
                description={material.description}
                xavfsizlik_darajasi={material.xavfsizlik_darajasi}
                video_url={material.video_url}
                file_path={material.file_path}
                created_at={material.created_at}
                type="video"
                onClick={() => setSelectedVideo(material)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}