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

describe('first test', () => {
  it('should pass', async () => {
    const db = drizzle(pg);
    const result = await db.execute('select 1 as num');
    expect(result.rows[0].num).toBe(1);
  });
});

