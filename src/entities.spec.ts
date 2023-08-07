import test from "node:test";
import assert from "node:assert/strict";
import { Category } from "./entities";
import { DataSource } from "typeorm";
import { CONNECTIONS } from "./connections";

async function createDataSource(options: any) {
  const dataSource = new DataSource(options);

  await dataSource.initialize();
  await dataSource.manager.delete(Category, {});
  return dataSource;
}

async function testLogic(options: any) {
  const total = 100;
  const dataSource = await createDataSource(options);
  const myArray = Array.from(Array(total).keys());
  for (const i of myArray) {
    await dataSource.manager.save(Category, {
      name: Math.random().toString(),
    });
  }
  const count = await dataSource.manager.count(Category);
  assert.equal(count, total);
  await dataSource.destroy();
}

test.describe("categories", { concurrency: true }, (t) => {
  test.test("normal", async () => {
    // @ts-ignore
    const options = CONNECTIONS[process.env.CONNECTION as string]["normal"];
    await testLogic(options);
  });

  test.test("tmpfs", async () => {
    // @ts-ignore
    const options = CONNECTIONS[process.env.CONNECTION as string]["tmpfs"];
    await testLogic(options);
  });
});
