import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

interface VideoPlayerProps {
  src?: string;
  title?: string;
  poster?: string;
}

export function VideoPlayer({ src, title, poster }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!src) {
    return (
      <Card className="w-full aspect-video">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Video fayl topilmadi</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle external links (YouTube, etc.)
  if (src.includes('youtube.com') || src.includes('youtu.be')) {
    const videoId = src.includes('youtu.be') 
      ? src.split('/').pop()?.split('?')[0]
      : new URL(src).searchParams.get('v');
    
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    
    return (
      <Card className="w-full aspect-video overflow-hidden">
        <CardContent className="p-0 h-full">
          <iframe
            src={embedUrl}
            title={title || 'Video'}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </CardContent>
      </Card>
    );
  }

  // Handle direct video files
  return (
    <Card className="w-full aspect-video relative overflow-hidden group">
      <CardContent className="p-0 h-full relative">
        <video
          className="w-full h-full object-cover"
          poster={poster}
          controls
          preload="metadata"
          playsInline
        >
          <source src={src} type="video/mp4" />
          <source src={src} type="video/webm" />
          Brauzeringiz video formatini qo'llab-quvvatlamaydi.
        </video>
        
        {/* Custom overlay controls (optional) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/20 hover:bg-white/30 text-white"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/20 hover:bg-white/30 text-white"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}