import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsClicker } from './stats-clicker';

describe('StatsClicker', () => {
  let component: StatsClicker;
  let fixture: ComponentFixture<StatsClicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsClicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsClicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
