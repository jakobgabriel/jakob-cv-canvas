import { Download, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";

const images = [
  {
    name: "LinkedIn Banner",
    file: "linkedin-banner.png",
    size: "1584 × 396",
    description: "Neutral abstract profile background",
  },
  {
    name: "Post Image",
    file: "linkedin-post.png",
    size: "1200 × 627",
    description: "Shareable post or feed image",
  },
  {
    name: "Article Cover",
    file: "linkedin-article-cover.png",
    size: "1200 × 644",
    description: "Article or newsletter header",
  },
  {
    name: "Profile Card",
    file: "linkedin-profile-card.png",
    size: "400 × 400",
    description: "Square card for sharing",
  },
];

export const LinkedInImagesSection = () => {
  const { trackDownload } = useAnalytics();

  return (
    <section className="py-16 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Image className="w-4 h-4" />
              LinkedIn Images
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Brand Assets
            </h2>
            <p className="text-muted-foreground text-sm">
              Download LinkedIn-optimized images for profile, posts, and articles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img) => (
              <div
                key={img.file}
                className="group relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                <div className="aspect-video bg-muted/30 overflow-hidden">
                  <img
                    src={`${import.meta.env.BASE_URL}linkedin/${img.file}`}
                    alt={img.name}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground text-sm">
                      {img.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {img.description} &middot; {img.size}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/10 hover:text-primary"
                    asChild
                  >
                    <a
                      href={`${import.meta.env.BASE_URL}linkedin/${img.file}`}
                      download={img.file}
                      onClick={() => trackDownload(img.file, "png")}
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
