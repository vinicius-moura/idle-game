import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Crew } from './crew';
import { GameService } from '../../services/game.service';
import { CREW_MEMBERS } from '../../data/crew.data';

describe('Crew', () => {
  let component: Crew;
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
    component = TestBed.createComponent(Crew).componentInstance;
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
});
