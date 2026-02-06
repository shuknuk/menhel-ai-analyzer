/**
 * Rebound AI Theme Constants
 * Clean, Clinical, High-Performance Aesthetic
 */

export const Colors = {
    // Clinical Light Theme
    background: {
        primary: '#F8FAFC',      // Slate 50 - Main background
        secondary: '#FFFFFF',    // Pure White - Cards/Elevated
        tertiary: '#E2E8F0',     // Slate 200 - Borders/Dividers
    },

    // Brand Accents (High Performance)
    accent: {
        primary: '#2563EB',      // Royal Blue - Primary Brand
        secondary: '#7C3AED',    // Electric Purple - Secondary Brand
        teal: '#0D9488',         // Clinical Teal - Success/Health
        orange: '#F59E0B',       // Warning/Energy
        red: '#EF4444',          // Alert/Error
    },

    // Shadows & Glass
    shadows: {
        soft: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        medium: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
        glow: '0px 0px 15px rgba(37, 99, 235, 0.3)', // Blue glow
    },

    // Glass effect overlays (Light Mode)
    glass: {
        light: 'rgba(255, 255, 255, 0.7)',
        medium: 'rgba(255, 255, 255, 0.85)',
        border: 'rgba(226, 232, 240, 0.6)', // Slate 200 with opacity
    },

    // Typography Colors
    text: {
        primary: '#0F172A',      // Slate 900 - Headings
        secondary: '#475569',    // Slate 600 - Body
        muted: '#94A3B8',        // Slate 400 - Captions
        inverse: '#FFFFFF',      // White text on dark buttons
    },

    // Status colors
    status: {
        success: '#10B981',      // Emerald 500
        warning: '#F59E0B',      // Amber 500
        error: '#EF4444',        // Red 500
        info: '#3B82F6',         // Blue 500
    },

    // Gradient presets
    gradients: {
        brand: ['#2563EB', '#7C3AED'], // Blue -> Purple
        success: ['#10B981', '#059669'], // Emerald -> Green
        heat: ['#F59E0B', '#EF4444'],    // Amber -> Red
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
};

export const Typography = {
    h1: {
        fontSize: 28,
        fontWeight: '700' as const,
        letterSpacing: -0.5,
        color: Colors.text.primary,
    },
    h2: {
        fontSize: 22,
        fontWeight: '600' as const,
        letterSpacing: -0.3,
        color: Colors.text.primary,
    },
    h3: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: Colors.text.primary,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        color: Colors.text.secondary,
        lineHeight: 24,
    },
    caption: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: Colors.text.muted,
    },
    small: {
        fontSize: 12,
        fontWeight: '500' as const,
        color: Colors.text.muted,
    },
};
