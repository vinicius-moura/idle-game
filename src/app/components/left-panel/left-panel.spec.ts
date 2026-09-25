import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LeftPanel } from './left-panel';
import { GameService } from '../../services/game.service';
import { Crew } from '../crew/crew';
import { Prestige } from '../prestige/prestige';

describe('LeftPanel', () => {
  it('shows crew control only when ship slots exist and opens both panels', () => {
    const state = signal<any>({ crew: { unlocked: [], slots: [] } });
    TestBed.configureTestingModule({ imports: [LeftPanel], providers: [{ provide: GameService, useValue: { state } }] });
    const fixture = TestBed.createComponent(LeftPanel);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.hasCrewSlots).toBeFalse();
    expect(fixture.nativeElement.querySelector('.crew')).toBeNull();

    state.set({ crew: { unlocked: [], slots: [{ slotType: 'captain', crewMemberId: null }] } });
    fixture.detectChanges();
    expect(component.hasCrewSlots).toBeTrue();
    fixture.nativeElement.querySelector('.crew').click();
    fixture.nativeElement.querySelector('.prestige').click();
    fixture.detectChanges();
    expect(component.crewOpen()).toBeTrue();
    expect(component.prestigeOpen()).toBeTrue();

    fixture.debugElement.query(By.directive(Crew)).componentInstance.close.emit();
    fixture.debugElement.query(By.directive(Prestige)).componentInstance.close.emit();
    fixture.detectChanges();
    expect(component.crewOpen()).toBeFalse();
    expect(component.prestigeOpen()).toBeFalse();
  });
});
