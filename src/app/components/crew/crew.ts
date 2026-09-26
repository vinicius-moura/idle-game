import { Component, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { GameService } from '../../services/game.service';
import { CREW_MEMBERS } from '../../data/crew.data';
import { SlotType, CrewMember } from '../../models/game.model';
import { Modal } from '../modal/modal';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-crew',
  standalone: true,
  imports: [CommonModule, DragDropModule, Modal, TranslatePipe],
  templateUrl: './crew.html',
  styleUrl: './crew.scss'
})

export class Crew {
  private gameService = inject(GameService);
  private i18n = inject(I18nService);
  state = this.gameService.state;
  allCrew = CREW_MEMBERS;
  readonly rosterTabs: SlotType[] = [
    'captain', 'combatant', 'navigator', 'sniper', 'cook',
    'medic', 'archaeologist', 'carpenter', 'musician', 'helmsman'
  ];
  selectedRosterTab = signal<SlotType | 'all'>('all');
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  get unlockedCrew(): CrewMember[] {
    const unlockedIds = this.state().crew.unlocked;
    return this.allCrew.filter(c => unlockedIds.includes(c.id));
  }

  get assignedIds(): string[] {
    return this.state().crew.slots
      .map(s => s.crewMemberId)
      .filter((id): id is string => id !== null);
  }

  get availableCrew(): CrewMember[] {
    return this.unlockedCrew.filter(c => !this.assignedIds.includes(c.id));
  }

  get filteredCrew(): CrewMember[] {
    const selectedSlot = this.selectedRosterTab();
    return selectedSlot === 'all'
      ? this.allCrew
      : this.allCrew.filter(member => member.slotType === selectedSlot);
  }

  selectRosterTab(slotType: SlotType | 'all'): void {
    this.selectedRosterTab.set(slotType);
  }

  isUnlocked(member: CrewMember): boolean {
    return this.state().crew.unlocked.includes(member.id);
  }

  getCrewInSlot(slotType: SlotType): CrewMember | null {
    const slot = this.state().crew.slots.find(s => s.slotType === slotType);
    if (!slot?.crewMemberId) return null;
    return this.allCrew.find(c => c.id === slot.crewMemberId) ?? null;
  }

  getSlotData(slotType: SlotType): CrewMember[] {
    const member = this.getCrewInSlot(slotType);
    return member ? [member] : [];
  }

  get slotIds(): string[] {
    return this.state().crew.slots.map(s => `slot-${s.slotType}`);
  }

  get lockedSlots(): SlotType[] {
    return this.gameService.lockedSlotTypes;
  }

  getCrewForSlotType(slotType: SlotType): CrewMember | null {
    return this.allCrew.find(c => c.slotType === slotType) ?? null;
  }

  onDropToSlot(event: CdkDragDrop<CrewMember[]>, slotType: SlotType) {
    const crew = event.item.data as CrewMember;
    if (crew.slotType !== slotType) return;
    this.gameService.assignCrew(crew.id, slotType);
  }

  onDropToAvailable(event: CdkDragDrop<CrewMember[]>) {
    const crew = event.item.data as CrewMember;
    this.gameService.removeCrew(crew.slotType);
  }

  slotLabel(slotType: SlotType): string {
    return this.i18n.translate(`slot.${slotType}`);
  }

  crewImage(member: CrewMember): string {
    return `crew/${member.id}.png`;
  }
}
