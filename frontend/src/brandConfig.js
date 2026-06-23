/**
 * SoleStream Brand Configuration
 * This file contains the design tokens for the SoleStream platform.
 */

export const BRAND_CONFIG = {
  colors: {
    primary: '#A8E6CF', // Mint Green
    secondary: '#E5D3B3', // Sand
    accent: '#FFFDD0', // Cream
    neutral: '#333333', // Charcoal
    background: '#F9FBF9', // Off-white (Mint tint)
    white: '#FFFFFF',
    error: '#FF6B6B',
    success: '#51CF66',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'Montserrat', 'Poppins', 'sans-serif'],
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  borderRadius: {
    sm: '4px',
    md: '8px', // Main token (8px)
    lg: '12px', // Main token (12px)
    full: '9999px',
  },
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  spacing: {
    container: '1.25rem',
    section: '4rem',
  }
};

/**
 * Tailwind CSS Theme Extension Object
 * You can spread this into your tailwind.config.js theme.extend
 */
export const TAILWIND_EXTEND = {
  colors: {
    brand: {
      primary: BRAND_CONFIG.colors.primary,
      secondary: BRAND_CONFIG.colors.secondary,
      accent: BRAND_CONFIG.colors.accent,
      neutral: BRAND_CONFIG.colors.neutral,
      background: BRAND_CONFIG.colors.background,
    }
  },
  borderRadius: {
    'brand-md': BRAND_CONFIG.borderRadius.md,
    'brand-lg': BRAND_CONFIG.borderRadius.lg,
  },
  fontFamily: {
    brand: BRAND_CONFIG.typography.fontFamily.sans,
  }
};
