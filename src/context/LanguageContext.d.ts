import type { ReactNode } from 'react';
import type { Lang } from '../types';

export interface LanguageContextValue {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: (path: string) => string;
  categoryLabel: (categoryKey: string) => string;
}

export function LanguageProvider(props: { children: ReactNode }): JSX.Element;

export function useLanguage(): LanguageContextValue;
