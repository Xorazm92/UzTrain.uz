import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  count?: number;
  gradient?: boolean;
}

export function CategoryCard({ title, description, icon: Icon, path, count, gradient = false }: CategoryCardProps) {
  const { t } = useTranslation();

  return (
    <Link to={path} className="block group">
      <Card className={`transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20 ${
        gradient ? 'bg-gradient-to-br from-primary/5 to-primary/10' : ''
      }`}>
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {count !== undefined && (
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-xs">
                {count} {count === 1 ? t('common.material') : t('common.materials')}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}