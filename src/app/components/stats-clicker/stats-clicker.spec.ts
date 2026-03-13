import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsClicker } from './stats-clicker';
import { GameService } from '../../services/game.service';
import { FormatNumberPipe } from '../../pipes/format-number-pipe';
import { signal } from '@angular/core';

describe('StatsClicker', () => {
  let component: StatsClicker;
  let fixture: ComponentFixture<StatsClicker>;
  let mockGameService: any;

  beforeEach(async () => {
    mockGameService = {
      state: signal({
        reputation: 0,
        reputationPerSecond: 0,
        clickPower: 5,
        prestige: { level: 0, permanentBonus: 1 },
        upgrades: {},
        currentShip: 'paper_boat'
      }),
      click: jasmine.createSpy('click')
    };

    await TestBed.configureTestingModule({
      imports: [StatsClicker, FormatNumberPipe],
      providers: [
        { provide: GameService, useValue: mockGameService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatsClicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call gameService.click when onBtnClick is executed', () => {
    component.onBtnClick();
    expect(mockGameService.click).toHaveBeenCalled();
  });

  it('should add a floating text when onBtnClick is executed', () => {
    component.onBtnClick();
    expect(component.floatingTexts.length).toBe(1);
    expect(component.floatingTexts[0].text).toBe('+5');
  });

  it('should remove floating text after timeout', () => {
    let timeoutCallback: Function = () => {};
    spyOn(window, 'setTimeout').and.callFake((callback: any) => {
      timeoutCallback = callback;
      return 1 as any;
    });

    component.onBtnClick();
    expect(component.floatingTexts.length).toBe(1);

    timeoutCallback();

    expect(component.floatingTexts.length).toBe(0);
  });

  it('should use correct ship image mapping', () => {
    expect(component.shipImages['paper_boat']).toBe('ships/ship_1.png');
    expect(component.shipImages['cosmic_clipper']).toBe('ships/ship_4.png');
  });

  it('should format floating text decimals correctly for amounts less than 1', () => {
    component.showFloatingText(0.5);
    expect(component.floatingTexts[0].text).toBe('+0.5');
  });
});