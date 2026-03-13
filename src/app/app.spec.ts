import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
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
});