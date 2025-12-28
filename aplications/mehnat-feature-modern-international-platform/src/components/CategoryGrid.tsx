import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Folder } from 'lucide-react';
import { FileCategory } from '@/lib/fileService';

interface CategoryGridProps {
  categories: FileCategory[];
  onCategorySelect: (categoryKey: string) => void;
}

export function CategoryGrid({ categories, onCategorySelect }: CategoryGridProps) {
  const getCategoryKey = (category: FileCategory): string => {
    // Find the key by matching the category object
    const entries = Object.entries({
      laws: { name: "Qonunlar", path: "/files/qonunlar" },
      manuals: { name: "Kasb yo'riqnomalari", path: "/files/mmm-kasb-yoriqnomalari" },
      rules: { name: "Qoidalar", path: "/files/qaror" },
      slides: { name: "Slaydlar", path: "/files/mmm-prezentatsiya" },
      railway: { name: "Temir yo'l hujjatlari", path: "/files/mmm-temir-yol" },
      videos: { name: "Video materiallar", path: "/files/video-materiallar" },
      banners: { name: "Bannerlar", path: "/files/mmm-bannerlar" }
    });

    const found = entries.find(([_, value]) => value.name === category.name);
    return found ? found[0] : 'unknown';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const categoryKey = getCategoryKey(category);
        return (
          <Card
            key={categoryKey}
            className="group railway-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20 backdrop-blur-sm"
            onClick={() => onCategorySelect(categoryKey)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {category.icon ? (
                      <span className="text-2xl">{category.icon}</span>
                    ) : (
                      <Folder className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {category.count} ta fayl
                    </Badge>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {category.description && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {category.description}
                </p>
              )}
              
              {/* Show some file examples */}
              {category.files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Misollar:</h4>
                  <div className="space-y-1">
                    {category.files.slice(0, 3).map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span className="truncate">{file.name}</span>
                      </div>
                    ))}
                    {category.files.length > 3 && (
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span>va yana {category.files.length - 3} ta fayl...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <Button
                variant="ghost"
                className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors btn-railway"
                onClick={(e) => {
                  e.stopPropagation();
                  onCategorySelect(categoryKey);
                }}
              >
                Ko'rish
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
