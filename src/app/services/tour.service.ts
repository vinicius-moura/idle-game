import { Injectable, inject } from '@angular/core';
import Shepherd, { Tour } from 'shepherd.js';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private readonly i18n = inject(I18nService);
  private tour: Tour | null = null;
  private readonly SHIP_TOUR_KEY = 'paperPiratesShipTourSeen';
  private readonly CLICK_TOUR_KEY = 'paperPiratesClickTourSeen';

  hasSeenTour(): boolean {
    return localStorage.getItem(this.SHIP_TOUR_KEY) === 'true';
  }

  hasSeenClickTour(): boolean {
    return localStorage.getItem(this.CLICK_TOUR_KEY) === 'true';
  }

  startClickTour(): void {
    if (this.hasSeenClickTour()) return;

    this.tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: false },
        scrollTo: true
      }
    });

    this.tour.addStep({
      id: 'click-tutorial',
      attachTo: { element: '#clicker-btn', on: 'right' },
      text: `
        <h3>🏴‍☠️ ${this.i18n.translate('tour.click.title')}</h3>
        <p>${this.i18n.translate('tour.click.body')}</p>
      `,
      buttons: [
        {
          text: this.i18n.translate('tour.click.button'),
          action: () => {
            localStorage.setItem(this.CLICK_TOUR_KEY, 'true');
            this.tour?.complete();
          }
        }
      ]
    });

    this.tour.start();
  }

  startShipTour(): void {
    if (this.hasSeenTour()) return;

    this.tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: false },
        scrollTo: true
      }
    });

    this.tour.addStep({
      id: 'ship-unlock',
      attachTo: { element: '#ship-tab', on: 'bottom' },
      text: `
        <h3>⚓ ${this.i18n.translate('tour.ship.title')}</h3>
        <p>${this.i18n.translate('tour.ship.body')}</p>
        <p>${this.i18n.translate('tour.ship.crew')}</p>
      `,
      buttons: [
        {
          text: this.i18n.translate('tour.ship.button'),
          action: () => {
            localStorage.setItem(this.SHIP_TOUR_KEY, 'true');
            this.tour?.complete();
          }
        }
      ]
    });

    this.tour.start();
  }
}
