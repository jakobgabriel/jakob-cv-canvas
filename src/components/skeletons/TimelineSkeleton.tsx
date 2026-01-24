import { Card } from "@/components/ui/card";

export const TimelineSkeleton = () => {
  return (
    <section className="py-20 relative bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          {/* Title Skeleton */}
          <div className="h-10 lg:h-12 bg-muted/50 rounded-lg max-w-md mx-auto mb-4 animate-pulse"></div>
          {/* Description Skeleton */}
          <div className="h-6 bg-muted/50 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Experience Section Skeleton */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="h-8 bg-muted/50 rounded-lg max-w-xs mx-auto lg:mx-0 animate-pulse"></div>
            </div>

            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="p-6">
                    <div className="flex items-start gap-4 w-full">
                      <div className="w-10 h-10 bg-muted/50 rounded-lg animate-pulse"></div>
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Date */}
                        <div className="h-4 bg-muted/50 rounded w-40 animate-pulse"></div>
                        {/* Position */}
                        <div className="h-5 bg-muted/50 rounded w-3/4 animate-pulse"></div>
                        {/* Company */}
                        <div className="h-4 bg-muted/50 rounded w-1/2 animate-pulse"></div>
                        {/* Summary */}
                        <div className="space-y-2">
                          <div className="h-3 bg-muted/50 rounded animate-pulse"></div>
                          <div className="h-3 bg-muted/50 rounded w-5/6 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="w-4 h-4 bg-muted/50 rounded animate-pulse"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Education Section Skeleton */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="h-8 bg-muted/50 rounded-lg max-w-xs mx-auto lg:mx-0 animate-pulse"></div>
            </div>

            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="p-6">
                    <div className="flex items-start gap-4 w-full">
                      <div className="w-10 h-10 bg-muted/50 rounded-lg animate-pulse"></div>
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Date */}
                        <div className="h-4 bg-muted/50 rounded w-40 animate-pulse"></div>
                        {/* Degree */}
                        <div className="h-5 bg-muted/50 rounded w-3/4 animate-pulse"></div>
                        {/* Institution */}
                        <div className="h-4 bg-muted/50 rounded w-1/2 animate-pulse"></div>
                        {/* Summary */}
                        <div className="space-y-2">
                          <div className="h-3 bg-muted/50 rounded animate-pulse"></div>
                          <div className="h-3 bg-muted/50 rounded w-5/6 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="w-4 h-4 bg-muted/50 rounded animate-pulse"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
