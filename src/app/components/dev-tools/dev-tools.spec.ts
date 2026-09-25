import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DevTools, WINDOW_REF } from './dev-tools';
import { GameService } from '../../services/game.service';

describe('DevTools', () => {
  it('provides the browser window by default', () => {
    expect(TestBed.inject(WINDOW_REF)).toBe(window);
  });

  it('adds reputation and resets local saves before reloading', () => {
    const state = signal<any>({ reputation: 25 });
    const reload = jasmine.createSpy('reload');
    const maximizeAccount = jasmine.createSpy('maximizeAccount');
    TestBed.configureTestingModule({ imports: [DevTools], providers: [
      { provide: GameService, useValue: { state, maximizeAccount } },
      { provide: WINDOW_REF, useValue: { location: { reload } } }
    ] });
    const component = TestBed.createComponent(DevTools).componentInstance;
    component.addReputation();
    expect(state().reputation).toBe(100025);

    spyOn(localStorage, 'clear');
    component.resetGame();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(reload).toHaveBeenCalled();
  });

  it('forwards the max account action to the game service', () => {
    const maximizeAccount = jasmine.createSpy('maximizeAccount');
    TestBed.configureTestingModule({ imports: [DevTools], providers: [
      { provide: GameService, useValue: { state: signal({ reputation: 0 }), maximizeAccount } }
    ] });
    const fixture = TestBed.createComponent(DevTools);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.dev-btn--max').click();
    expect(maximizeAccount).toHaveBeenCalled();
  });
});
