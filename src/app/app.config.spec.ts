import { appConfig } from './app.config';
import { routes } from './app.routes';

describe('Application configuration', () => {
  it('registers router and browser error handling providers', () => {
    expect(appConfig.providers?.length).toBe(3);
    expect(routes).toEqual([]);
  });
});
