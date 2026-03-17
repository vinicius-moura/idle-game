import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modal } from './modal';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal]
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when onClose is called', () => {
    const closeSpy = jasmine.createSpy('closeSpy');
    component.close.subscribe(closeSpy);

    component.onClose();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should emit close when clicking the overlay', () => {
    const closeSpy = jasmine.createSpy('closeSpy');
    component.close.subscribe(closeSpy);

    const overlay = fixture.nativeElement.querySelector('.modal');
    overlay.click();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should NOT emit close when clicking the modal content', () => {
    const closeSpy = jasmine.createSpy('closeSpy');
    component.close.subscribe(closeSpy);

    const content = fixture.nativeElement.querySelector('.modal-content');
    content.click();

    expect(closeSpy).not.toHaveBeenCalled();
  });
});