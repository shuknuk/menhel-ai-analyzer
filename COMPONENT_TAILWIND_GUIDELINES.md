# ReboundAI Component Guidelines (TailwindCSS)

This document provides TailwindCSS-based equivalents for the core UI components and design tokens in the ReboundAI project. Use these definitions to maintain consistency across the Figma "ReboundAI Design Map" and the application.

## Design Tokens

### Colors (Tailwind Config)
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#F8F9FA',
          secondary: '#FFFFFF',
          tertiary: '#E9EDC9',
          dark: '#0D1102',
        },
        accent: {
          primary: '#606C38',
          secondary: '#283618',
          teal: '#869042',
          orange: '#D4A373',
          red: '#BC4749',
          lime: '#D9ED92', // Dark mode contrast
        },
        text: {
          primary: '#101204',
          secondary: '#42481D',
          muted: '#707459',
        }
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      }
    }
  }
}
```

## Component Guidelines
**Props:**
- `size`: number (default: 40)
- `color`: string (hex, default: #606C38)

**Tailwind Guidelines:**
- **Ball:** `rounded-full`, `z-20`. Apply the `color` prop as `bg-[${color}]`.
- **Shadow:** `bg-black/10`, `rounded-full`, `z-10`.
- **Animation:** Use `animate-bounce` or custom keyframes for "Squash and Stretch".
    - `scale-y-[0.6]` at impact.
    - `scale-x-[1.3]` at impact.

## 2. ChatBubble
**Props:**
- `message`: ChatMessage { role: 'user' | 'ai', content: string, timestamp: Date }
- `index`: number

**Tailwind Guidelines:**
- **Container:** `mb-4`, `max-w-[80%]`. User: `self-end`. AI: `self-start`.
- **Bubble:** `p-4`, `rounded-lg`, `shadow-sm`.
    - **User Bubble:** `bg-primary`, `rounded-br-sm`.
    - **AI Bubble:** `bg-secondary-bg`, `border border-secondary-border`, `rounded-bl-sm`.
- **Text:** `text-base`, `leading-[22px]`.
- **Timestamp:** `text-sm`, `mt-1`, `opacity-60`, `self-end`.

## 3. GlassCard
**Props:**
- `intensity`: number (default: 80)
- `entering`: 'fade' | 'fadeUp' | 'fadeDown' | 'none'
- `tint`: 'light' | 'dark' | 'default'

**Tailwind Guidelines:**
- **Container:** `rounded-lg`, `overflow-hidden`, `border`, `shadow-xl`.
- **Glass Effect:** `backdrop-blur-[intensity]`.
    - **Light Mode:** `bg-white/60`, `border-white/40`.
    - **Dark Mode:** `bg-slate-900/60`, `border-white/15`.
- **Spacing:** `p-4` (md spacing).

## 4. OrbitSystem
**Props:**
- `wellnessScore`: number
- `tasks`: DailyTask[]
- `onTaskPress`: function

**Tailwind Guidelines:**
- **Sun (Center):** `w-[120px]`, `h-[120px]`, `rounded-full`, `shadow-inner`.
    - Gradient: `from-orange-500`, `to-red-500`.
- **Orbit Paths:** `border`, `border-primary/20`, `rounded-full`, `absolute`.
- **Planets:** `w-10`, `h-10`, `rounded-full`, `bg-primary`, `border-2`, `border-secondary-bg`, `flex`, `items-center`, `justify-center`, `shadow-md`.

## 5. WellnessGraph
**Props:**
- `data`: DataPoint[] { date, mood, pain }
- `height`: number (default: 200)

**Tailwind Guidelines:**
- **Container:** `p-2`.
- **Title:** `text-lg`, `font-bold`.
- **Line Colors:**
    - **Mood:** `stroke-teal-500`, `fill-teal-500/50` (gradient).
    - **Pain:** `stroke-secondary`, `fill-secondary/30` (gradient).
- **Grid:** `stroke-primary/20`.
