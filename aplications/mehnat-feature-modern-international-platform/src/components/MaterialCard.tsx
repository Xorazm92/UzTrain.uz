import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Video, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface MaterialCardProps {
  id: number;
  title: string;
  description?: string;
  xavfsizlik_darajasi: string;
  file_path?: string;
  video_url?: string;
  created_at: string;
  type: 'document' | 'video' | 'slide';
  onClick?: () => void;
}

const safetyLevelColors = {
  'sanoat_xavfsizligi': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  'mehnat_muhofazasi': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  'sogliqni_saqlash': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  'yol_harakati': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  'yongin_xavfsizligi': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  'elektr_xavfsizligi': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
};

const safetyLevelKeys = {
  'sanoat_xavfsizligi': 'industrial',
  'mehnat_muhofazasi': 'labor',
  'sogliqni_saqlash': 'health',
  'yol_harakati': 'traffic',
  'yongin_xavfsizligi': 'fire',
  'elektr_xavfsizligi': 'electrical',
};

export function MaterialCard({
  id,
  title,
  description,
  xavfsizlik_darajasi,
  file_path,
  video_url,
  created_at,
  type,
  onClick
}: MaterialCardProps) {
  const { t } = useTranslation();
  const getIcon = () => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'slide':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const handleFileOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video_url) {
      window.open(video_url, '_blank');
    } else if (file_path) {
      window.open(file_path, '_blank');
    }
  };

  const safetyColorClass = safetyLevelColors[xavfsizlik_darajasi as keyof typeof safetyLevelColors] || 'bg-gray-100 text-gray-800';
  const safetyKey = safetyLevelKeys[xavfsizlik_darajasi as keyof typeof safetyLevelKeys];
  const safetyName = safetyKey ? t(`safety.${safetyKey}`) : xavfsizlik_darajasi;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/20" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 text-primary">
            {getIcon()}
            <span className="text-sm font-medium capitalize">{type}</span>
          </div>
          <Badge className={`text-xs ${safetyColorClass}`}>
            {safetyName}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </span>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClick}
              className="text-xs"
            >
              <Eye className="h-4 w-4 mr-1" />
              {t('common.view')}
            </Button>
            {(file_path || video_url) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFileOpen}
                className="text-xs"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                {t('common.open')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}