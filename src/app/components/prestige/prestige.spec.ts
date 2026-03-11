import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prestige } from './prestige';

describe('Prestige', () => {
  let component: Prestige;
  let fixture: ComponentFixture<Prestige>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prestige]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prestige);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
