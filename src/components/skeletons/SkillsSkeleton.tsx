import { Card } from "@/components/ui/card";

export const SkillsSkeleton = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          {/* Title Skeleton */}
          <div className="h-10 lg:h-12 skeleton-shimmer rounded-lg max-w-md mx-auto mb-4"></div>
          {/* Description Skeleton */}
          <div className="h-6 skeleton-shimmer rounded-lg max-w-2xl mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {/* Core Competencies Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
            <div className="space-y-4">
              <div className="h-6 skeleton-shimmer rounded w-3/4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 skeleton-shimmer rounded-full" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 skeleton-shimmer rounded w-3/4" style={{ animationDelay: `${i * 0.1 + 0.05}s` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Languages Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
            <div className="space-y-4">
              <div className="h-6 skeleton-shimmer rounded w-2/3"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 skeleton-shimmer rounded-full" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 skeleton-shimmer rounded w-4/5" style={{ animationDelay: `${i * 0.1 + 0.05}s` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Certifications Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
            <div className="space-y-4">
              <div className="h-6 skeleton-shimmer rounded w-3/4"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 skeleton-shimmer rounded w-5/6" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    <div className="h-3 skeleton-shimmer rounded w-2/3" style={{ animationDelay: `${i * 0.1 + 0.05}s` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Technical Skills Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="h-6 skeleton-shimmer rounded w-48"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-20 skeleton-shimmer rounded-lg" style={{ animationDelay: `${i * 0.05}s` }}></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
