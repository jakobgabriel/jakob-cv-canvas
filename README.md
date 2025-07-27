# Jakob Gabriel - Digital Resume

A modern, clean, and minimal digital resume built with React, TypeScript, and Tailwind CSS. Perfect for private equity professionals and business executives. Content is managed through JSON Resume schema for industry-standard compatibility.

## ✨ Features

- **JSON Resume Standard**: Uses industry-standard JSON Resume schema for compatibility
- **Multi-language Support**: English and German content with dynamic switching
- **Modern PE-style Design**: Clean, minimal design suitable for private equity professionals
- **Responsive**: Optimized for all devices and screen sizes
- **Dark/Light Mode**: Professional theme switching
- **GitHub Pages Ready**: Configured for automatic deployment
- **Extensible Social Profiles**: Support for LinkedIn, GitHub, X (Twitter), Xing, and more

## 📁 Data Structure

All content follows the [JSON Resume schema](https://jsonresume.org/schema/) stored in `public/data/resume.json`:

### Core Sections
- **basics**: Personal information, contact details, and social profiles
- **work**: Professional experience with highlights and keywords
- **education**: Academic background with achievements
- **skills**: Core competencies organized by categories
- **languages**: Language proficiencies
- **certificates**: Professional certifications
- **projects**: Notable projects (optional)
- **interests**: Professional interests (optional)

### Configuration
- `public/data/config.json`: Feature toggles and theme settings

## 🔧 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, or bun

### Development Setup
```bash
# Clone the repository
git clone https://github.com/jakobgabriel/jakob-cv-canvas.git
cd jakob-cv-canvas

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📝 Content Management

### Editing Your Resume
1. Open `public/data/resume.json`
2. Update the relevant sections (English: `en`, German: `de`)
3. Commit and push changes
4. GitHub Actions automatically rebuilds and deploys

### Adding Social Profiles
The system supports multiple social networks. Add profiles to the `basics.profiles` array:

```json
{
  "basics": {
    "profiles": [
      {
        "network": "LinkedIn",
        "username": "your-username",
        "url": "https://linkedin.com/in/your-username"
      },
      {
        "network": "GitHub", 
        "username": "your-username",
        "url": "https://github.com/your-username"
      },
      {
        "network": "X",
        "username": "your-handle",
        "url": "https://x.com/your-handle"
      },
      {
        "network": "Xing",
        "username": "your-username", 
        "url": "https://xing.com/profile/your-username"
      }
    ]
  }
}
```

### Supported Social Networks
- LinkedIn
- GitHub
- X (Twitter)
- Xing
- Instagram
- Facebook
- Website/Portfolio

## 🚀 Deployment

### GitHub Pages (Automatic)
1. Fork this repository
2. Update `vite.config.ts` with your repository name
3. Enable GitHub Pages in repository settings
4. Set source to "GitHub Actions"
5. Push to `main` branch to trigger deployment

### Custom Domain
1. Add your domain to GitHub Pages settings
2. Update the `cname` field in `.github/workflows/deploy.yml`
3. Configure DNS to point to GitHub Pages

## 🎨 Customization

### Design System
The professional design is defined in:
- `src/index.css`: CSS custom properties and global styles
- `tailwind.config.ts`: Tailwind theme configuration

### Color Palette
Current theme uses a professional charcoal and white palette suitable for private equity:
- Primary: Professional blue
- Background: Clean whites and subtle grays
- Text: High contrast for readability

### Adding New Features
1. Update `public/data/config.json` to enable/disable features
2. Modify components in `src/components/resume/`
3. Use the `useJsonResume()` hook to access data

## 🌍 Multi-language Support

The resume supports multiple languages:
- English (`en`)
- German (`de`)

Add new languages by:
1. Adding language data to `resume.json`
2. Updating `src/contexts/LanguageContext.tsx`
3. Adding translation keys

## 📋 JSON Resume Schema Compliance

This resume follows the official [JSON Resume](https://jsonresume.org/) standard, making it:
- Compatible with JSON Resume tools
- Easily exportable to other formats
- Industry-standard structured data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - Feel free to use this template for your own professional resume.

---

**Built for professionals by professionals** | React + TypeScript + Tailwind CSS