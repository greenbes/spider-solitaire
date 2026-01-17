import type { Theme } from './types'

export interface ThemeStyles {
  // Main background
  background: string
  // Accent colors (for stock pile, empty slots, etc.)
  accent: string
  accentHover: string
  accentBorder: string
  // Text colors
  text: string
  textMuted: string
  // Empty slot styling
  emptySlotBg: string
  emptySlotBorder: string
}

export const THEME_STYLES: Record<Theme, ThemeStyles> = {
  'green-felt': {
    background: 'bg-emerald-900',
    accent: 'bg-emerald-800',
    accentHover: 'hover:bg-emerald-700',
    accentBorder: 'border-emerald-700',
    text: 'text-emerald-300',
    textMuted: 'text-emerald-500/50',
    emptySlotBg: 'bg-emerald-800/20',
    emptySlotBorder: 'border-emerald-600/40',
  },
  'blue-felt': {
    background: 'bg-blue-900',
    accent: 'bg-blue-800',
    accentHover: 'hover:bg-blue-700',
    accentBorder: 'border-blue-700',
    text: 'text-blue-300',
    textMuted: 'text-blue-500/50',
    emptySlotBg: 'bg-blue-800/20',
    emptySlotBorder: 'border-blue-600/40',
  },
  'wood': {
    background: 'bg-amber-900',
    accent: 'bg-amber-800',
    accentHover: 'hover:bg-amber-700',
    accentBorder: 'border-amber-700',
    text: 'text-amber-300',
    textMuted: 'text-amber-500/50',
    emptySlotBg: 'bg-amber-800/20',
    emptySlotBorder: 'border-amber-600/40',
  },
  'dark': {
    background: 'bg-neutral-900',
    accent: 'bg-neutral-800',
    accentHover: 'hover:bg-neutral-700',
    accentBorder: 'border-neutral-700',
    text: 'text-neutral-300',
    textMuted: 'text-neutral-500/50',
    emptySlotBg: 'bg-neutral-800/20',
    emptySlotBorder: 'border-neutral-600/40',
  },
}

export function getThemeStyles(theme: Theme): ThemeStyles {
  return THEME_STYLES[theme] || THEME_STYLES['green-felt']
}
