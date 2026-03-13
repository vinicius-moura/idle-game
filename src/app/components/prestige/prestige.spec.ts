import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Prestige } from './prestige';
import { GameService } from '../../services/game.service';
import { signal } from '@angular/core';

describe('Prestige', () => {
  let component: Prestige;
  let fixture: ComponentFixture<Prestige>;
  let mockGameService: any;

  beforeEach(async () => {
    mockGameService = {
      state: signal({
        reputation: 0,
        reputationPerSecond: 0,
        clickPower: 1,
        prestige: { level: 0, permanentBonus: 1 },
        upgrades: {},
        currentShip: 'paper_boat'
      })
    };

    await TestBed.configureTestingModule({
      imports: [Prestige],
      providers: [
        { provide: GameService, useValue: mockGameService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Prestige);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct state values', () => {
    expect(component.state()).toEqual(mockGameService.state());
    expect(component.state().reputation).toBe(0);
    expect(component.state().currentShip).toBe('paper_boat');
  });

  it('should have a prestige method defined', () => {
    expect(component.prestige).toBeDefined();
    component.prestige();
  });
});