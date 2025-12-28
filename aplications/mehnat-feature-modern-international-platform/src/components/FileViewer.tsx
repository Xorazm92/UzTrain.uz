import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Download, FileText, ExternalLink, Clock, Tag } from 'lucide-react';
import { FileItem, formatFileSize, getFileIcon, getFilePreview } from '@/lib/fileService';
import { FilePreview } from '@/components/FilePreview';
import { formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';

interface FileViewerProps {
  file: FileItem;
  showPreview?: boolean;
  compact?: boolean;
}

export function FileViewer({ file, showPreview = true, compact = false }: FileViewerProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDownload = () => {
    window.open(file.path, '_blank');
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'doc':
      case 'docx': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ppt':
      case 'pptx': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'xls':
      case 'xlsx': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getFileIcon(file.type)}</span>
          <div>
            <h4 className="font-medium text-sm">{file.name}</h4>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {showPreview && (
            <Button variant="ghost" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="group railway-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/20 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getFileIcon(file.type)}</span>
              <Badge className={getFileTypeColor(file.type)}>
                {file.type.toUpperCase()}
              </Badge>
            </div>
            <Badge variant="outline" className="bg-primary/10 border-primary/20">
              {file.category}
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {file.name}
          </CardTitle>
          {file.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {file.description}
            </p>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* File info */}
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <FileText className="h-4 w-4" />
                {formatFileSize(file.size)}
              </span>
              {file.lastModified && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {formatDistanceToNow(file.lastModified, { addSuffix: true, locale: uz })}
                </span>
              )}
            </div>

            {/* Tags */}
            {file.tags && file.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {file.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {file.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{file.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              {showPreview && (
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 hover:bg-primary/10 hover:border-primary/30">
                      <Eye className="h-4 w-4 mr-2" />
                      Ko'rish
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <span className="text-2xl">{getFileIcon(file.type)}</span>
                        {file.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Kategoriya:</strong> {file.category}
                        </div>
                        <div>
                          <strong>Hajmi:</strong> {formatFileSize(file.size)}
                        </div>
                        <div>
                          <strong>Turi:</strong> {file.type.toUpperCase()}
                        </div>
                        {file.lastModified && (
                          <div>
                            <strong>O'zgartirilgan:</strong> {formatDistanceToNow(file.lastModified, { addSuffix: true, locale: uz })}
                          </div>
                        )}
                      </div>

                      {file.description && (
                        <div>
                          <strong>Tavsif:</strong>
                          <p className="mt-1 text-muted-foreground">{file.description}</p>
                        </div>
                      )}

                      {/* File Preview */}
                      <FilePreview file={file} />

                      <div className="flex space-x-2">
                        <Button onClick={handleDownload} className="flex-1 btn-railway">
                          <Download className="h-4 w-4 mr-2" />
                          Yuklab olish
                        </Button>
                        <Button variant="outline" onClick={() => window.open(file.path, '_blank')} className="hover:bg-primary/10">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Yangi oynada ochish
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="default" size="sm" onClick={handleDownload} className="flex-1 btn-railway">
                <Download className="h-4 w-4 mr-2" />
                Yuklab olish
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
