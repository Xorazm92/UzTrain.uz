import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'hero' | 'category';
  count?: number;
}

export function LoadingSkeleton({ type = 'card', count = 1 }: LoadingSkeletonProps) {
  const renderCardSkeleton = () => (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-6 w-3/4 mt-2" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCategorySkeleton = () => (
    <Card className="w-full">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-3">
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-center">
          <Skeleton className="h-6 w-20" />
        </div>
      </CardContent>
    </Card>
  );

  const renderListSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );

  const renderHeroSkeleton = () => (
    <div className="text-center space-y-4">
      <Skeleton className="h-16 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
      <Skeleton className="h-6 w-2/3 max-w-3xl mx-auto" />
      <div className="mt-8">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );

  if (type === 'hero') {
    return renderHeroSkeleton();
  }

  if (type === 'list') {
    return renderListSkeleton();
  }

  if (type === 'category') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{renderCategorySkeleton()}</div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderCardSkeleton()}</div>
      ))}
    </div>
  );
}
