import { migrateApplicationState } from './migrator';
import { expect, it, vi } from 'vitest';
import type { DataStateV3 } from './types';

vi.mock('@i18n/index', () => ({ initialLocale: 'en' }));

it('adds empty savings groups when migrating V3 data', () => {
  const state: DataStateV3 = {
    version: 3,
    currency: 'EUR',
    locale: 'en',
    years: [
      {
        year: 2025,
        income: [],
        expenses: []
      }
    ]
  };

  const migrated = migrateApplicationState(state);

  expect(migrated.version).toBe(4);
  expect(migrated.years[0].savings).toEqual([]);
  expect(migrated.years[0].income).toEqual([]);
  expect(migrated.years[0].expenses).toEqual([]);
});
