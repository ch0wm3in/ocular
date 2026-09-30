import { initialLocale } from '@i18n/index';
import { createMigration, createMigrator } from 'yuppee';
import type { DataStateV1, DataStateV2, DataStateV3, DataStateV4 } from '@store/state/types';

type Versions = DataStateV1 | DataStateV2 | DataStateV3 | DataStateV4;

export const migrateApplicationState = createMigrator<DataStateV4, Versions>({
  init: () => ({ expenses: [], income: [] }),
  migrations: [
    createMigration<DataStateV1, DataStateV2>({
      from: 1,
      to: 2,
      migrate: (from) => ({
        years: [
          {
            year: new Date().getFullYear(),
            expenses: from.expenses,
            income: from.income
          }
        ]
      })
    }),
    createMigration<DataStateV2, DataStateV3>({
      from: 2,
      to: 3,
      migrate: (from) => ({
        locale: initialLocale,
        currency: 'EUR',
        years: from.years
      })
    }),
    createMigration<DataStateV3, DataStateV4>({
      from: 3,
      to: 4,
      migrate: (from) => ({
        locale: from.locale,
        currency: from.currency,
        years: from.years.map((year) => ({ ...year, savings: [] }))
      })
    })
  ]
});
