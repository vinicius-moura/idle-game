import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { I18nService } from './services/i18n.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
    TestBed.inject(I18nService).setLanguage('en');
  });

  it('must create the parent component (App)', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the UI components (shop, clicker and prestige)', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-upgrade-shop')).toBeTruthy();
    expect(compiled.querySelector('app-stats-clicker')).toBeTruthy();
    expect(compiled.querySelector('app-prestige')).toBeTruthy();
  });

  it('opens the language modal from the settings dropdown', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const app = fixture.componentInstance;

    app.toggleSettingsMenu();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="menuitem"]')).toBeTruthy();

    app.openLanguageSettings();
    fixture.detectChanges();
    expect(app.isSettingsMenuOpen).toBeFalse();
    expect(fixture.nativeElement.querySelector('app-modal h2')?.textContent).toContain('Language');

    app.closeLanguageSettings();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-modal')).toBeNull();
  });

  it('switches the game language from the language modal', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const i18n = TestBed.inject(I18nService);
    app.isLanguageModalOpen = true;
    fixture.detectChanges();

    const portugueseButton = fixture.nativeElement.querySelector('.language-options button') as HTMLButtonElement;
    expect(portugueseButton.querySelector('.language-flag--br')).toBeTruthy();
    portugueseButton.click();
    fixture.detectChanges();
    expect(i18n.language()).toBe('pt');
    expect(fixture.nativeElement.querySelector('.settings-trigger').getAttribute('aria-label')).toBe('Configurações');
    expect(fixture.nativeElement.querySelector('.shop-tab').textContent).toContain('Melhorias');

    const englishButton = fixture.nativeElement.querySelectorAll('.language-options button')[1] as HTMLButtonElement;
    expect(englishButton.querySelector('.language-flag--us')).toBeTruthy();
    englishButton.click();
    fixture.detectChanges();
    expect(i18n.language()).toBe('en');
    expect(fixture.nativeElement.querySelector('.settings-trigger').getAttribute('aria-label')).toBe('Settings');
  });
});
