import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate.pipe';
import { I18nService } from '../services/i18n.service';

describe('TranslatePipe', () => {
  it('returns the current translation and reflects language changes', () => {
    TestBed.configureTestingModule({ imports: [TranslatePipe] });
    const pipe = TestBed.runInInjectionContext(() => new TranslatePipe());
    const i18n = TestBed.inject(I18nService);
    i18n.setLanguage('en');
    expect(pipe.transform('shop.upgrades')).toBe('Upgrades');
    i18n.setLanguage('pt');
    expect(pipe.transform('shop.upgrades')).toBe('Melhorias');
  });
});
