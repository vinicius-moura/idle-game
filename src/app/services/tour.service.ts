import { Injectable } from '@angular/core';
import Shepherd, { Tour } from 'shepherd.js';

@Injectable({
  providedIn: 'root'
})
export class TourService {
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
        <h3>🏴‍☠️ Welcome, Captain!</h3>
        <p>Click your ship to earn Reputation and build your pirate legend!</p>
      `,
      buttons: [
        {
          text: "Let's go! ⚓",
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
        <h3>⚓ A new horizon appears, Captain!</h3>
        <p>Your reputation precedes you. It's time to upgrade your vessel.</p>
        <p>Bigger ships unlock <strong>crew slots</strong> — and your crew changes everything.</p>
      `,
      buttons: [
        {
          text: 'Set Sail! 🏴‍☠️',
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