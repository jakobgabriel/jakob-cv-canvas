# Digital Resume - Jakob Gabriel

A modern, responsive digital resume built with React, TypeScript, and Tailwind CSS. Content is managed through YAML files for easy updates and deployment to GitHub Pages.

## 🚀 Features

- **YAML-based Content Management**: All personal information, experience, education, and skills are stored in YAML files
- **Modern Design**: Clean, professional design with dark/light mode support
- **Responsive**: Optimized for all device sizes
- **Interactive Timeline**: Slide-in detail panels for experience and education
- **GitHub Pages Ready**: Configured for automatic deployment

## 📁 Content Management

All content is stored in YAML files in the `public/data/` directory:

- `personal.yaml` - Personal information, contact details, and bio
- `experience.yaml` - Professional experience entries
- `education.yaml` - Educational background
- `skills.yaml` - Core competencies and leadership skills

### Editing Content

1. Navigate to the `public/data/` folder
2. Edit the relevant YAML file
3. Commit and push changes
4. GitHub Actions will automatically rebuild and deploy

### YAML Structure Examples

#### Personal Information (`personal.yaml`)
```yaml
name:
  first: "Your First Name"
  last: "Your Last Name"
title: "Your Professional Title"
bio: "Your professional bio..."
contact:
  email: "your.email@example.com"
  linkedin: "https://linkedin.com/in/yourprofile"
  github: "https://github.com/yourusername"
```

#### Experience (`experience.yaml`)
```yaml
- title: "Job Title"
  company: "Company Name"
  period: "2020 - Present"
  year: "2020"
  description: "Job description..."
  achievements:
    - "Achievement 1"
    - "Achievement 2"
  technologies:
    - "Technology 1"
    - "Technology 2"
```

## 🛠 Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🚀 Deployment to GitHub Pages

### Automatic Deployment
This project is configured with GitHub Actions for automatic deployment:

1. Push changes to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your site will be available at `https://yourusername.github.io/your-repo-name/`

### Manual Setup
1. Enable GitHub Pages in your repository settings
2. Set source to "GitHub Actions"
3. Update the `base` URL in `vite.config.ts` to match your repository name
4. Push changes to trigger deployment

### Custom Domain
To use a custom domain:
1. Add your domain to the `cname` field in `.github/workflows/deploy.yml`
2. Configure your domain's DNS to point to GitHub Pages
3. Enable custom domain in GitHub Pages settings

## 🎨 Customization

### Colors and Theme
The design system is defined in `src/index.css`. Update CSS variables to change:
- Colors (light and dark mode)
- Gradients and effects
- Typography and spacing

### Adding New Sections
1. Create a new YAML file in `public/data/`
2. Define TypeScript interfaces in `src/types/data.ts`
3. Create a new component using the `useYamlData` hook
4. Add the component to your page layout

## 📝 License

MIT License - feel free to use this template for your own resume!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ using React, TypeScript, and Tailwind CSS