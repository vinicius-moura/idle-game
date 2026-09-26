import { Injectable, signal } from '@angular/core';
import { Language, TRANSLATIONS } from '../i18n/translations';

const LANGUAGE_STORAGE_KEY = 'paperBoatPirates.language';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly language = signal<Language>(this.getInitialLanguage());

  constructor() {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = this.language();
    }
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }

  translate(key: string, params: Record<string, string> = {}): string {
    let value = TRANSLATIONS[this.language()][key] ?? TRANSLATIONS.en[key] ?? key;
    for (const [name, replacement] of Object.entries(params)) {
      value = value.replaceAll(`{{${name}}}`, replacement);
    }
    return value;
  }

  private getInitialLanguage(): Language {
    if (typeof localStorage !== 'undefined') {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage === 'pt' || savedLanguage === 'en') return savedLanguage;
    }
    const browserLanguage = navigator.language.toLowerCase();
    return browserLanguage.startsWith('pt') ? 'pt' : 'en';
  }
}
