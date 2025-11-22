# drizzle-orm-test example module

<p align="center">
  <img src="https://raw.githubusercontent.com/launchql/launchql/refs/heads/main/assets/outline-logo.svg" width="250"><br />
    drizzle-orm-test
</p>

A testing utility for [Drizzle ORM](https://orm.drizzle.team/) that provides fast, isolated PostgreSQL testing. Powered by [pgsql-test](https://www.npmjs.com/package/pgsql-test).

## Overview

`drizzle-orm-test` provides:

- Fast test execution with transaction-based isolation
- Proper cleanup between tests
- Full Drizzle ORM capabilities in your tests
- Type-safe database queries

## Example

See `__tests__/drizzle-orm-test.test.ts` for a complete example. The key pattern is:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { getConnections, PgTestClient } from 'drizzle-orm-test';

let db: PgTestClient;
let pg: PgTestClient;
let teardown: () => Promise<void>;

beforeAll(async () => {
  ({ pg, db, teardown } = await getConnections());
});

afterAll(async () => {
  await teardown();
});

beforeEach(async () => {
  await db.beforeEach();
});

afterEach(async () => {
  await db.afterEach();
});

describe('your tests', () => {
  it('should work with standard Drizzle pattern', async () => {
    const drizzleDb = drizzle(db.client);
    const result = await drizzleDb.execute('select 1 as num');
    expect(result.rows[0].num).toBe(1);
  });
});
```

## RLS Testing

Test Row Level Security with context management:

```typescript
it('user should only see their own rows', async () => {
  db.setContext({
    role: 'authenticated',
    'jwt.claims.user_id': '1'
  });

  const drizzleDb = drizzle(db.client);
  const rows = await drizzleDb.select().from(users);

  expect(rows.every(r => r.userId === '1')).toBe(true);
});
```


## Running Tests

```sh
pnpm test
# or
pnpm test:watch
```

## Credits

🛠 Built by LaunchQL — if you like our tools, please checkout and contribute to [our github ⚛️](https://github.com/launchql)


## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating this software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the code, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
