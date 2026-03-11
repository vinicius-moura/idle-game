import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeItem } from './upgrade-item';

describe('UpgradeItem', () => {
  let component: UpgradeItem;
  let fixture: ComponentFixture<UpgradeItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
