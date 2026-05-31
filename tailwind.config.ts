import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	future: {
		hoverOnlyWhenSupported: true,
	},
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
		fontFamily: {
			inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
			display: ['DM Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
			mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
		},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
					glow: "hsl(var(--primary-glow))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
			},
			animation: {
				"accordion-down": "accordion-down 0.2s cubic-bezier(0.23, 1, 0.32, 1)",
				"accordion-up": "accordion-up 0.2s cubic-bezier(0.23, 1, 0.32, 1)",
				"fade-in": "fade-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards",
				"fade-in-up": "fade-in-up 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards",
				"slide-up": "slide-up 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
				"scale-in": "scale-in 0.45s cubic-bezier(0.23, 1, 0.32, 1)",
				"bounce-in": "bounce-in 0.6s cubic-bezier(0.34, 1.3, 0.64, 1)",
				"pulse-slow": "pulse-slow 3s ease-in-out infinite",
				"float": "float 3s ease-in-out infinite",
				"shimmer": "shimmer 2s infinite",
				"bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
				"slide-in-right": "slide-in-right 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
				"progress-fill": "progress-fill 1s cubic-bezier(0.23, 1, 0.32, 1) forwards",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(8px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"fade-in-up": {
					"0%": { opacity: "0", transform: "translateY(8px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"slide-up": {
					"0%": { opacity: "0", transform: "translateY(8px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"scale-in": {
					"0%": { opacity: "0", transform: "scale(0.95)" },
					"100%": { opacity: "1", transform: "scale(1)" },
				},
				"bounce-in": {
					"0%": { opacity: "0", transform: "scale(0.95)" },
					"60%": { opacity: "1", transform: "scale(1.02)" },
					"100%": { opacity: "1", transform: "scale(1)" },
				},
				"pulse-slow": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.5" },
				},
				"float": {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"shimmer": {
					"0%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "200% 0" },
				},
				"bounce-gentle": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-8px)" },
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
				/* Consumer must set transform-origin: left */
				"progress-fill": {
					"0%": { transform: "scaleX(0)" },
					"100%": { transform: "scaleX(1)" },
				},
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;