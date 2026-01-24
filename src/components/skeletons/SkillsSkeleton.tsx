import { Card } from "@/components/ui/card";

export const SkillsSkeleton = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          {/* Title Skeleton */}
          <div className="h-10 lg:h-12 bg-muted/50 rounded-lg max-w-md mx-auto mb-4 animate-pulse"></div>
          {/* Description Skeleton */}
          <div className="h-6 bg-muted/50 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {/* Core Competencies Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
            <div className="space-y-4">
              <div className="h-6 bg-muted/50 rounded w-3/4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted/50 rounded w-5/6 animate-pulse"></div>
                    <div className="h-2 bg-muted/50 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Languages Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
            <div className="space-y-4">
              <div className="h-6 bg-muted/50 rounded w-2/3 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted/50 rounded w-4/5 animate-pulse"></div>
                    <div className="h-2 bg-muted/50 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Certifications Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6">
            <div className="space-y-4">
              <div className="h-6 bg-muted/50 rounded w-3/4 animate-pulse"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted/50 rounded w-5/6 animate-pulse"></div>
                    <div className="h-3 bg-muted/50 rounded w-2/3 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Technical Skills Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="h-6 bg-muted/50 rounded w-48 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="h-9 bg-muted/50 rounded animate-pulse" style={{ animationDelay: `${i * 0.05}s` }}></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
