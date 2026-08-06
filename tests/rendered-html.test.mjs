import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("finished experience replaces the starter", async () => {
  const [site, layout, pkg] = await Promise.all([
    readFile(new URL("app/site-app.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);
  assert.match(site, /衣冠藏卷/);
  assert.match(site, /一卷古籍/);
  assert.match(site, /开始寻衣/);
  assert.match(site, /圆领袍/);
  assert.match(layout, /中华古籍服饰文化数字探索平台/);
  assert.doesNotMatch(`${site}${layout}${pkg}`, /codex-preview|Building your site|react-loading-skeleton/);
});

test("submission workflow uses platform persistence", async () => {
  const [hosting, schema, route] = await Promise.all([
    readFile(new URL(".openai/hosting.json", root), "utf8"),
    readFile(new URL("db/schema.ts", root), "utf8"),
    readFile(new URL("app/api/submissions/route.ts", root), "utf8"),
  ]);
  assert.match(hosting, /"d1": "DB"/);
  assert.match(hosting, /"r2": "UPLOADS"/);
  assert.match(schema, /submissions/);
  assert.match(route, /env\.UPLOADS\.put/);
});
