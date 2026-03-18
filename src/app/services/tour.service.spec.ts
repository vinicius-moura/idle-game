import { TestBed } from '@angular/core/testing';
import { TourService } from './tour.service';
import Shepherd from 'shepherd.js';

describe('TourService', () => {
  let service: TourService;
  let mockTour: any;

  beforeEach(() => {
    localStorage.clear();

    mockTour = {
      addStep: jasmine.createSpy('addStep'),
      start: jasmine.createSpy('start'),
      complete: jasmine.createSpy('complete')
    };

    spyOn(Shepherd, 'Tour' as any).and.returnValue(mockTour);

    TestBed.configureTestingModule({});
    service = TestBed.inject(TourService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('hasSeenTour', () => {
    it('should return false if ship tour has not been seen', () => {
      expect(service.hasSeenTour()).toBeFalse();
    });

    it('should return true if ship tour has been seen', () => {
      localStorage.setItem('paperPiratesShipTourSeen', 'true');
      expect(service.hasSeenTour()).toBeTrue();
    });
  });

  describe('hasSeenClickTour', () => {
    it('should return false if click tour has not been seen', () => {
      expect(service.hasSeenClickTour()).toBeFalse();
    });

    it('should return true if click tour has been seen', () => {
      localStorage.setItem('paperPiratesClickTourSeen', 'true');
      expect(service.hasSeenClickTour()).toBeTrue();
    });
  });

  describe('startClickTour', () => {
    it('should start the click tour if not seen', () => {
      service.startClickTour();
      expect(mockTour.start).toHaveBeenCalled();
    });

    it('should not start the click tour if already seen', () => {
      localStorage.setItem('paperPiratesClickTourSeen', 'true');
      service.startClickTour();
      expect(mockTour.start).not.toHaveBeenCalled();
    });

    it('should add a step with correct id', () => {
      service.startClickTour();
      expect(mockTour.addStep).toHaveBeenCalledWith(
        jasmine.objectContaining({ id: 'click-tutorial' })
      );
    });

    it('should mark click tour as seen and complete it when button action is called', () => {
      service.startClickTour();
      const stepConfig = mockTour.addStep.calls.mostRecent().args[0];
      const buttonAction = stepConfig.buttons[0].action.bind(service);
      buttonAction();
      expect(localStorage.getItem('paperPiratesClickTourSeen')).toBe('true');
      expect(mockTour.complete).toHaveBeenCalled();
    });
  });

  describe('startShipTour', () => {
    it('should start the ship tour if not seen', () => {
      service.startShipTour();
      expect(mockTour.start).toHaveBeenCalled();
    });

    it('should not start the ship tour if already seen', () => {
      localStorage.setItem('paperPiratesShipTourSeen', 'true');
      service.startShipTour();
      expect(mockTour.start).not.toHaveBeenCalled();
    });

    it('should add a step with correct id', () => {
      service.startShipTour();
      expect(mockTour.addStep).toHaveBeenCalledWith(
        jasmine.objectContaining({ id: 'ship-unlock' })
      );
    });

    it('should mark ship tour as seen and complete it when button action is called', () => {
      service.startShipTour();
      const stepConfig = mockTour.addStep.calls.mostRecent().args[0];
      const buttonAction = stepConfig.buttons[0].action.bind(service);
      buttonAction();
      expect(localStorage.getItem('paperPiratesShipTourSeen')).toBe('true');
      expect(mockTour.complete).toHaveBeenCalled();
    });
  });
});