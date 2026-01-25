import { Card } from "@/components/ui/card";

export const TimelineSkeleton = () => {
  return (
    <section className="py-20 relative bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          {/* Title Skeleton */}
          <div className="h-10 lg:h-12 skeleton-shimmer rounded-lg max-w-md mx-auto mb-4"></div>
          {/* Description Skeleton */}
          <div className="h-6 skeleton-shimmer rounded-lg max-w-2xl mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Experience Section Skeleton */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="h-8 skeleton-shimmer rounded-lg max-w-xs mx-auto lg:mx-0"></div>
            </div>

            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 card-accent">
                  <div className="p-6">
                    <div className="flex items-start gap-4 w-full">
                      <div className="w-10 h-10 skeleton-shimmer rounded-lg"></div>
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Date */}
                        <div className="h-4 skeleton-shimmer rounded w-40" style={{ animationDelay: `${index * 0.1}s` }}></div>
                        {/* Position */}
                        <div className="h-5 skeleton-shimmer rounded w-3/4" style={{ animationDelay: `${index * 0.1 + 0.05}s` }}></div>
                        {/* Company */}
                        <div className="h-4 skeleton-shimmer rounded w-1/2" style={{ animationDelay: `${index * 0.1 + 0.1}s` }}></div>
                        {/* Summary */}
                        <div className="space-y-2">
                          <div className="h-3 skeleton-shimmer rounded" style={{ animationDelay: `${index * 0.1 + 0.15}s` }}></div>
                          <div className="h-3 skeleton-shimmer rounded w-5/6" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}></div>
                        </div>
                      </div>
                      <div className="w-4 h-4 skeleton-shimmer rounded"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Education Section Skeleton */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <div className="h-8 skeleton-shimmer rounded-lg max-w-xs mx-auto lg:mx-0"></div>
            </div>

            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 card-accent">
                  <div className="p-6">
                    <div className="flex items-start gap-4 w-full">
                      <div className="w-10 h-10 skeleton-shimmer rounded-lg"></div>
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Date */}
                        <div className="h-4 skeleton-shimmer rounded w-40" style={{ animationDelay: `${index * 0.1}s` }}></div>
                        {/* Degree */}
                        <div className="h-5 skeleton-shimmer rounded w-3/4" style={{ animationDelay: `${index * 0.1 + 0.05}s` }}></div>
                        {/* Institution */}
                        <div className="h-4 skeleton-shimmer rounded w-1/2" style={{ animationDelay: `${index * 0.1 + 0.1}s` }}></div>
                        {/* Summary */}
                        <div className="space-y-2">
                          <div className="h-3 skeleton-shimmer rounded" style={{ animationDelay: `${index * 0.1 + 0.15}s` }}></div>
                          <div className="h-3 skeleton-shimmer rounded w-5/6" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}></div>
                        </div>
                      </div>
                      <div className="w-4 h-4 skeleton-shimmer rounded"></div>
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
