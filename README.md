# drizzle-orm-test demo

<p align="center">
  <img src="https://raw.githubusercontent.com/launchql/launchql/refs/heads/main/assets/outline-logo.svg" width="250"><br />
    drizzle-orm-test demo
</p>

This demo shows how to use `drizzle-orm-test` for fast, isolated PostgreSQL testing with [Drizzle ORM](https://orm.drizzle.team/). The package is powered by [pgsql-test](https://www.npmjs.com/package/pgsql-test).

## What is drizzle-orm-test?

`drizzle-orm-test` provides a testing utility for Drizzle ORM with isolated PostgreSQL databases and transaction-based cleanup between tests.

## Usage

Here's how to use it:

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

Check out the [package source](./packages/drizzle) and [test examples](./packages/drizzle/__tests__) to see how it works!


## Developing

```sh
docker-compose up
pnpm install
cd packages/drizzle
pnpm test:watch
```

## Credits

🛠 Built by LaunchQL — checkout [our github ⚛️](https://github.com/launchql)


## Disclaimer

AS DESCRIBED IN THE LICENSES, THE SOFTWARE IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT WARRANTIES OF ANY KIND.

No developer or entity involved in creating this software will be liable for any claims or damages whatsoever associated with your use, inability to use, or your interaction with other users of the code, including any direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value.
