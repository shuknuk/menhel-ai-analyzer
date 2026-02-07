/**
 * Rebound AI Theme Constants
 * Clean, Clinical, High-Performance Aesthetic
 */

export const LightColors = {
    background: {
        primary: '#F8F9FA', // Clean light background
        secondary: '#FFFFFF',
        tertiary: '#E9EDC9', // Muted sage from palette
    },
    accent: {
        primary: '#606C38', // Dark Olive
        secondary: '#283618', // Deep Forest
        teal: '#869042', // Olive
        orange: '#D4A373', // Earth Tone
        red: '#BC4749',
    },
    text: {
        primary: '#101204', // Deepest green-black from palette
        secondary: '#42481D', // Muted olive
        muted: '#707459', // Sage dark
        inverse: '#FFFFFF',
    },
    status: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
    },
};

export const DarkColors = {
    background: {
        primary: '#0D1102', // Deeper green-black
        secondary: '#1A1D0E', // Dark olive background
        tertiary: '#2D3319', // Elevated forest green
    },
    accent: {
        primary: '#D9ED92', // Brighter lime-green for high contrast
        secondary: '#B5C99A', // Muted sage
        teal: '#97A97C', // Olive
        orange: '#FFD449', // High-vis gold/orange
        red: '#FF6B6B',
    },
    text: {
        primary: '#F1F5E1', // Ivory green for peak readability
        secondary: '#D9E0C1', // Light sage
        muted: '#A3AD8C', // Accessible sage gray
        inverse: '#0D1102',
    },
    status: {
        success: '#52B788',
        warning: '#FFD449',
        error: '#FF6B6B',
        info: '#72EFDD',
    },
};

export const Colors = LightColors; // Legacy support will be removed eventually

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
        fontSize: 32,
        fontWeight: '800' as const,
        letterSpacing: -1,
    },
    h2: {
        fontSize: 24,
        fontWeight: '700' as const,
        letterSpacing: -0.5,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        letterSpacing: -0.3,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
    },
    caption: {
        fontSize: 14,
        fontWeight: '500' as const,
    },
    small: {
        fontSize: 12,
        fontWeight: '500' as const,
    },
};
