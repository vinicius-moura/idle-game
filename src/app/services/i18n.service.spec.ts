import { TestBed } from '@angular/core/testing';
import { I18nService } from './i18n.service';

describe('I18nService', () => {
  const storageKey = 'paperBoatPirates.language';
  let originalLanguage: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalLanguage = Object.getOwnPropertyDescriptor(navigator, 'language')!;
    localStorage.removeItem(storageKey);
  });

  afterEach(() => {
    localStorage.removeItem(storageKey);
    if (originalLanguage) {
      Object.defineProperty(navigator, 'language', originalLanguage);
    } else {
      Reflect.deleteProperty(navigator, 'language');
    }
    TestBed.resetTestingModule();
  });

  function createService(): I18nService {
    TestBed.configureTestingModule({});
    return TestBed.inject(I18nService);
  }

  it('uses a saved Portuguese language preference', () => {
    localStorage.setItem(storageKey, 'pt');
    expect(createService().language()).toBe('pt');
  });

  it('uses a saved English language preference', () => {
    localStorage.setItem(storageKey, 'en');
    expect(createService().language()).toBe('en');
  });

  it('detects Portuguese from the browser language', () => {
    Object.defineProperty(navigator, 'language', { value: 'pt-BR', configurable: true });
    expect(createService().language()).toBe('pt');
  });

  it('falls back to English for unsupported browser languages or invalid saved values', () => {
    localStorage.setItem(storageKey, 'es');
    Object.defineProperty(navigator, 'language', { value: 'es-ES', configurable: true });
    expect(createService().language()).toBe('en');
  });

  it('changes the language, persists it, and updates the document locale', () => {
    const service = createService();
    service.setLanguage('pt');
    expect(service.language()).toBe('pt');
    expect(localStorage.getItem(storageKey)).toBe('pt');
    expect(document.documentElement.lang).toBe('pt');
  });

  it('translates keys, substitutes parameters, and falls back to the key when missing', () => {
    const service = createService();
    service.setLanguage('pt');
    expect(service.translate('crew.drop', { slot: 'Capitão' })).toBe('Solte Capitão aqui');
    expect(service.translate('missing.translation.key')).toBe('missing.translation.key');
  });
});
