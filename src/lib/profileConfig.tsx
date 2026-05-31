import {
  LinkedinIcon,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  ExternalLink,
  Globe,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import type { JsonResumeBasics } from "@/types/jsonResume";

/**
 * Shared social/profile network configuration.
 *
 * Previously this map was duplicated in both Index.tsx and HeroSection.tsx.
 * It is now the single source of truth — import the map and the
 * `getAvailableProfiles` helper instead of redefining either.
 */

interface IconProps {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

type ProfileIcon = LucideIcon | ((props: IconProps) => JSX.Element);

interface ProfileConfig {
  icon: ProfileIcon;
  color: string;
}

const XIcon = ({ className = "w-4 h-4", ...props }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Configuration for the most common platforms. Keys match the JSON Resume
// `network` field. The extra `Calendly` key is harmless for consumers that
// don't surface it, since rendering is gated by the profiles in the data.
export const profileConfigs: Record<string, ProfileConfig> = {
  LinkedIn: { icon: LinkedinIcon, color: "text-blue-600 dark:text-blue-400" },
  GitHub: { icon: Github, color: "text-gray-900 dark:text-gray-100" },
  Twitter: { icon: Twitter, color: "text-blue-400 dark:text-blue-300" },
  X: { icon: XIcon, color: "text-gray-900 dark:text-gray-100" },
  Instagram: { icon: Instagram, color: "text-pink-600 dark:text-pink-400" },
  Facebook: { icon: Facebook, color: "text-blue-600 dark:text-blue-400" },
  YouTube: { icon: Youtube, color: "text-red-600 dark:text-red-400" },
  Portfolio: { icon: ExternalLink, color: "text-purple-600 dark:text-purple-400" },
  Website: { icon: Globe, color: "text-green-600 dark:text-green-400" },
  Calendly: { icon: CalendarDays, color: "text-blue-500 dark:text-blue-400" },
};

/**
 * Returns the profiles from a resume `basics` object that have a known
 * configuration entry, preserving the original order.
 */
export const getAvailableProfiles = (
  basics?: Pick<JsonResumeBasics, "profiles"> | null,
) => basics?.profiles?.filter((profile) => profileConfigs[profile.network]) ?? [];
