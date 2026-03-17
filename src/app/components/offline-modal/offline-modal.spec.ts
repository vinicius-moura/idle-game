import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflineModal } from './offline-modal';
import { GameService } from '../../services/game.service';
import { signal, WritableSignal } from '@angular/core';

describe('OfflineModal', () => {
  let component: OfflineModal;
  let fixture: ComponentFixture<OfflineModal>;
  let mockGameService: jasmine.SpyObj<GameService>;
  let offlineGains: WritableSignal<number | null>;

  beforeEach(async () => {
    offlineGains = signal<number | null>(null);

    mockGameService = jasmine.createSpyObj('GameService', ['dismissOfflineGains'], {
      offlineGains
    });

    await TestBed.configureTestingModule({
      imports: [OfflineModal],
      providers: [{ provide: GameService, useValue: mockGameService }]
    }).compileComponents();

    fixture = TestBed.createComponent(OfflineModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show modal when offlineGains is null', () => {
    const modal = fixture.nativeElement.querySelector('app-modal');
    expect(modal).toBeNull();
  });

  it('should show modal when offlineGains has a value', () => {
    offlineGains.set(500);
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('app-modal');
    expect(modal).toBeTruthy();
  });

  it('should call dismissOfflineGains when collect button is clicked', () => {
    offlineGains.set(500);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(mockGameService.dismissOfflineGains).toHaveBeenCalled();
  });
});