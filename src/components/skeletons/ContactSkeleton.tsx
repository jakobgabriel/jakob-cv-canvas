import { Card } from "@/components/ui/card";

export const ContactSkeleton = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          {/* Title Skeleton */}
          <div className="h-10 lg:h-12 bg-muted/50 rounded-lg max-w-md mx-auto mb-4 animate-pulse"></div>
          {/* Description Skeleton */}
          <div className="h-6 bg-muted/50 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-8 max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Name and Email row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted/50 rounded w-20 animate-pulse"></div>
                <div className="h-10 bg-muted/50 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted/50 rounded w-20 animate-pulse"></div>
                <div className="h-10 bg-muted/50 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <div className="h-4 bg-muted/50 rounded w-24 animate-pulse"></div>
              <div className="h-10 bg-muted/50 rounded animate-pulse"></div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <div className="h-4 bg-muted/50 rounded w-28 animate-pulse"></div>
              <div className="h-32 bg-muted/50 rounded animate-pulse"></div>
            </div>

            {/* Submit Button */}
            <div className="h-10 bg-muted/50 rounded animate-pulse"></div>
          </div>
        </Card>
      </div>
    </section>
  );
};
