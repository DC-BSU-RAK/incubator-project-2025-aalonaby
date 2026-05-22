import { useEffect } from 'react';
import { getCurrentUser } from './auth';

export type ThemeName = 'aura-light' | 'midnight' | 'nature';

export const THEMES: { value: ThemeName; label: string; description: string }[] = [
  { value: 'aura-light', label: 'Aura Light', description: 'Calm purple & lavender' },
  { value: 'midnight', label: 'Midnight Focus', description: 'Dark mode for late nights' },
  { value: 'nature', label: 'Nature Calm', description: 'Soft greens for grounding' },
];

export function applyTheme(theme: ThemeName) {
  const root = document.documentElement;
  root.classList.remove('theme-midnight', 'theme-nature');
  if (theme === 'midnight') root.classList.add('theme-midnight');
  if (theme === 'nature') root.classList.add('theme-nature');
  localStorage.setItem('mindaura_theme', theme);
}

export function getTheme(): ThemeName {
  const user = getCurrentUser();
  return (user?.theme as ThemeName) || (localStorage.getItem('mindaura_theme') as ThemeName) || 'aura-light';
}

export function useThemeBootstrap() {
  useEffect(() => {
    applyTheme(getTheme());
  }, []);
}
