export const HeroSkeleton = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center bg-gradient-hero pt-16 pb-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden will-change-transform pointer-events-none">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="hidden sm:block absolute bottom-1/4 right-20 w-40 h-40 bg-primary-glow/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Portrait Skeleton */}
          <div className="flex justify-center">
            <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-muted/50 animate-pulse"></div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-5">
            <div className="space-y-3">
              {/* Name */}
              <div className="h-14 lg:h-16 bg-muted/50 rounded-lg max-w-md mx-auto animate-pulse"></div>
              {/* Label */}
              <div className="h-7 lg:h-8 bg-muted/50 rounded-lg max-w-sm mx-auto animate-pulse"></div>

              {/* Badges */}
              <div className="flex justify-center">
                <div className="flex flex-wrap gap-2 justify-center items-center max-w-2xl">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-7 w-24 bg-muted/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 max-w-2xl mx-auto">
              <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
              <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
              <div className="h-4 bg-muted/50 rounded w-3/4 mx-auto animate-pulse"></div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="h-5 w-32 bg-muted/50 rounded animate-pulse"></div>
              <div className="h-8 w-40 bg-muted/50 rounded animate-pulse"></div>
            </div>

            {/* Button */}
            <div className="h-12 w-48 bg-muted/50 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
