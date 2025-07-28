// Performance optimization utilities

// Lazy loading intersection observer
export const createLazyLoader = (callback: () => void) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px'
    });
    return observer;
  }
  // Fallback for browsers without IntersectionObserver
  return null;
};

// Preload critical resources
export const preloadCriticalResources = () => {
  console.log("Preloading critical resources...");
  try {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap';
    fontLink.as = 'style';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
    console.log("Font preloading completed");
  } catch (error) {
    console.error("Error preloading resources:", error);
  }
};

// Optimize images with modern formats
export const getOptimizedImageSrc = (src: string, width?: number) => {
  if (!src) return src;
  
  // Check if browser supports WebP
  const supportsWebP = (() => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  })();

  // For now, return original src (can be enhanced with image optimization service)
  return src;
};

// Cache management
export const cacheManager = {
  set: (key: string, data: any, ttl: number = 3600000) => { // 1 hour default
    const item = {
      data,
      expiry: Date.now() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  
  get: (key: string) => {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  },
  
  clear: (key?: string) => {
    if (key) {
      localStorage.removeItem(key);
    } else {
      localStorage.clear();
    }
  }
};

// Resource hints
export const addResourceHints = () => {
  // DNS prefetch for external resources
  const dnsPrefetch = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  dnsPrefetch.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Critical CSS injection
export const injectCriticalCSS = () => {
  const criticalCSS = `
    /* Above-the-fold critical styles */
    html { scroll-behavior: smooth; }
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 0;
    }
    .loading-skeleton {
      background: linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--muted-foreground)/10%) 50%, hsl(var(--muted)) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  
  const style = document.createElement('style');
  style.innerHTML = criticalCSS;
  document.head.appendChild(style);
};