import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Crew } from './crew';
import { GameService } from '../../services/game.service';
import { CREW_MEMBERS } from '../../data/crew.data';
import { I18nService } from '../../services/i18n.service';

describe('Crew', () => {
  let component: Crew;
  let fixture: ComponentFixture<Crew>;
  let gameService: any;

  beforeEach(() => {
    gameService = {
      state: signal({ crew: { unlocked: ['luffy', 'zoro'], slots: [
        { slotType: 'captain', crewMemberId: null },
        { slotType: 'combatant', crewMemberId: 'zoro' }
      ] } }),
      lockedSlotTypes: ['navigator'],
      assignCrew: jasmine.createSpy('assignCrew'),
      removeCrew: jasmine.createSpy('removeCrew')
    };
    TestBed.configureTestingModule({ imports: [Crew], providers: [{ provide: GameService, useValue: gameService }] });
    TestBed.inject(I18nService).setLanguage('en');
    fixture = TestBed.createComponent(Crew);
    component = fixture.componentInstance;
  });

  it('derives unlocked, assigned, available, and locked crew data', () => {
    expect(component.unlockedCrew.map(member => member.id)).toEqual(['luffy', 'zoro']);
    expect(component.assignedIds).toEqual(['zoro']);
    expect(component.availableCrew.map(member => member.id)).toEqual(['luffy']);
    expect(component.isUnlocked(CREW_MEMBERS[0])).toBeTrue();
    expect(component.isUnlocked(CREW_MEMBERS[2])).toBeFalse();
    expect(component.lockedSlots).toEqual(['navigator']);
    expect(component.slotIds).toEqual(['slot-captain', 'slot-combatant']);
  });

  it('filters the roster by class and restores the full roster', () => {
    expect(component.rosterTabs).toHaveSize(10);
    expect(component.filteredCrew).toHaveSize(10);
    component.selectRosterTab('captain');
    expect(component.filteredCrew.map(member => member.id)).toEqual(['luffy']);
    component.selectRosterTab('cook');
    expect(component.filteredCrew.map(member => member.id)).toEqual(['sanji']);
    component.selectRosterTab('all');
    expect(component.filteredCrew).toHaveSize(10);
  });

  it('returns slot member data, empty values, and crew by role', () => {
    expect(component.getCrewInSlot('combatant')?.id).toBe('zoro');
    expect(component.getSlotData('combatant').map(member => member.id)).toEqual(['zoro']);
    expect(component.getCrewInSlot('captain')).toBeNull();
    expect(component.getSlotData('captain')).toEqual([]);
    expect(component.getCrewForSlotType('navigator')?.id).toBe('nami');
    expect(component.getCrewForSlotType('helmsman')?.id).toBe('jinbe');
  });

  it('handles stale crew ids and unknown slot roles safely', () => {
    gameService.state.set({ crew: { unlocked: [], slots: [{ slotType: 'captain', crewMemberId: 'removed-member' }] } });
    expect(component.getCrewInSlot('captain')).toBeNull();
    expect(component.getCrewForSlotType('unknown' as any)).toBeNull();
  });

  it('labels every crew slot and builds member image paths', () => {
    const labels = ['Captain', 'Combatant', 'Navigator', 'Sniper', 'Cook', 'Medic', 'Historian', 'Carpenter', 'Musician', 'Helmsman'];
    const roles = ['captain', 'combatant', 'navigator', 'sniper', 'cook', 'medic', 'archaeologist', 'carpenter', 'musician', 'helmsman'] as const;
    roles.forEach((role, index) => expect(component.slotLabel(role)).toBe(labels[index]));
    expect(component.crewImage(CREW_MEMBERS[0])).toBe('crew/luffy.png');
    TestBed.inject(I18nService).setLanguage('pt');
    expect(component.slotLabel('captain')).toBe('Capitão');
    TestBed.inject(I18nService).setLanguage('en');
  });

  it('assigns only a member to the matching slot and removes dropped crew', () => {
    const zoro = CREW_MEMBERS.find(member => member.id === 'zoro')!;
    component.onDropToSlot({ item: { data: zoro } } as any, 'combatant');
    expect(gameService.assignCrew).toHaveBeenCalledWith('zoro', 'combatant');
    component.onDropToSlot({ item: { data: zoro } } as any, 'captain');
    expect(gameService.assignCrew).toHaveBeenCalledTimes(1);
    component.onDropToAvailable({ item: { data: zoro } } as any);
    expect(gameService.removeCrew).toHaveBeenCalledWith('combatant');
  });

  it('shows equipped status and buff text separately from unequipped and locked crew', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const activeSlot = fixture.nativeElement.querySelector('.crew-active-info') as HTMLElement;
    expect(activeSlot.textContent).toContain('EQUIPPED · BUFF ACTIVE');
    expect(activeSlot.textContent).toContain('5% chance for a critical click');

    const cards = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.crew-roster-card')) as HTMLElement[];
    const zoroCard = cards.find(card => card.textContent?.includes('Roronoa Zoro'))!;
    const luffyCard = cards.find(card => card.textContent?.includes('Monkey D. Luffy'))!;
    const lockedCard = cards.find(card => card.textContent?.includes('LOCKED'))!;

    expect(zoroCard.textContent).toContain('EQUIPPED · ACTIVE');
    expect(luffyCard.textContent).toContain('UNEQUIPPED · INACTIVE');
    expect(lockedCard.textContent).toContain('Unlock this pirate to reveal their buff.');

    const tabs = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('[role="tab"]')) as HTMLButtonElement[];
    const classTab = tabs.find(tab => tab.textContent?.trim() === 'Combatant')!;
    classTab.click();
    fixture.detectChanges();
    expect(classTab.getAttribute('aria-selected')).toBe('true');
    expect(fixture.nativeElement.querySelectorAll('.crew-roster-card')).toHaveSize(1);
    expect(fixture.nativeElement.querySelector('.crew-roster-card').textContent).toContain('Roronoa Zoro');
  });
});
