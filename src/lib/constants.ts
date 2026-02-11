/**
 * Humana Brand Constants
 * Colors and brand configurations extracted from the Figma design
 */

export const BRAND = {
  name: "Humana",
  tagline: "Demo",
} as const;

/**
 * Humana Brand Colors
 * Based on the Figma design system
 */
export const COLORS = {
  // AI Status Colors
  ai: {
    enabled: {
      bg: "#DCFCE7",
      border: "#15803D",
      text: "#15803D",
    },
    disabled: {
      bg: "#FEF2F2",
      border: "#F87171",
      text: "#F87171",
    },
  },
  // Patient Status Colors
  status: {
    active: {
      bg: "#E5E5E5",
      text: "#171717",
    },
    intake: {
      bg: "transparent",
      border: "rgba(255, 255, 255, 0.1)",
      text: "#FAFAFA",
    },
  },
} as const;

/**
 * Sidebar navigation configuration
 */
export const NAVIGATION = {
  main: [
    {
      title: "Dashboard",
      icon: "LayoutDashboard",
      url: "/dashboard",
    },
    {
      title: "Patients",
      icon: "Users",
      url: "/",
    },
    {
      title: "Notes & Insights",
      icon: "FileText",
      url: "/notes",
    },
  ],
} as const;
