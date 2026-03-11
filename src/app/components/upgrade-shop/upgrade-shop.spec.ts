import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeShop } from './upgrade-shop';

describe('UpgradeShop', () => {
  let component: UpgradeShop;
  let fixture: ComponentFixture<UpgradeShop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeShop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeShop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
