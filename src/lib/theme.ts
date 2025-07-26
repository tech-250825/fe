/**
 * Theme Configuration Guide
 * 
 * Your project now uses a dark theme by default with shadcn/ui color system.
 * To change colors, modify the CSS variables in src/app/globals.css
 * 
 * Current dark theme color mapping:
 * - Primary background: Pure black (#000000)
 * - Cards/panels: Very dark gray (oklch(0.067 0 0))
 * - Text: White for primary, light gray for secondary/muted
 * - Borders: Dark gray tones
 * - Accents: Blue primary with other standard colors
 */

// Utility classes using shadcn/ui system (current implementation)
export const themeClasses = {
  // Backgrounds - using shadcn variables
  bgPrimary: 'bg-background',      // Main background 
  bgSecondary: 'bg-card',          // Card/panel backgrounds
  bgMuted: 'bg-muted',             // Muted backgrounds
  
  // Text - using shadcn variables  
  textPrimary: 'text-foreground',        // Main text
  textSecondary: 'text-muted-foreground', // Secondary text
  textAccent: 'text-primary',            // Accent text
  
  // Borders - using shadcn variables
  border: 'border-border',         // Standard borders
  
  // Interactive elements
  button: 'bg-primary text-primary-foreground hover:bg-primary/90',
  buttonSecondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
} as const;

/**
 * To change the theme colors:
 * 
 * 1. Light theme: Modify the :root section in globals.css
 * 2. Dark theme: Modify the .dark section in globals.css  
 * 3. Add 'dark' class to html element (already done in layout.tsx)
 * 
 * Key CSS variables to modify:
 * - --background: Main background color
 * - --foreground: Main text color  
 * - --card: Card/panel background
 * - --muted-foreground: Secondary text
 * - --border: Border colors
 * - --primary: Accent color
 */

// Quick theme switching function for future light/dark toggle
export const toggleTheme = () => {
  const html = document.documentElement;
  html.classList.toggle('dark');
};

// Check current theme
export const isDarkTheme = () => {
  if (typeof window === 'undefined') return true; // Default to dark on server
  return document.documentElement.classList.contains('dark');
};