import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradeItem } from './upgrade-item';
import { FormatNumberPipe } from '../../pipes/format-number-pipe';

describe('UpgradeItem', () => {
  let component: UpgradeItem;
  let fixture: ComponentFixture<UpgradeItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeItem, FormatNumberPipe]
    }).compileComponents();

    fixture = TestBed.createComponent(UpgradeItem);
    component = fixture.componentInstance;
    
    component.upgrade = { id: 'test_upgrade', name: 'Test' };
    component.level = 1;
    component.cost = 100;
    component.canAfford = true;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit buy event with upgrade id when onBuy is called', () => {
    spyOn(component.buy, 'emit');
    
    component.onBuy();
    
    expect(component.buy.emit).toHaveBeenCalledWith('test_upgrade');
  });

  it('should receive input properties correctly', () => {
    expect(component.level).toBe(1);
    expect(component.cost).toBe(100);
    expect(component.canAfford).toBeTrue();
  });
});