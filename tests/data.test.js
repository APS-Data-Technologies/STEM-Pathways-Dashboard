import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  validateData,
  filterRows,
  byYear,
  groupTotals,
  growth,
  sum,
  summary,
} from "../src/data.js";
const read = (n) =>
  JSON.parse(
    readFileSync(new URL(`../public/data/${n}.json`, import.meta.url)),
  );
const rows = read("completions"),
  institutions = read("institutions"),
  metadata = read("metadata");
test("committed data satisfies contract", () =>
  assert.equal(validateData(rows, institutions, metadata).rows.length, 3808));
test("rejects duplicate, negative and orphan records", () => {
  for (const bad of [
    [...rows, rows[0]],
    [{ ...rows[0], completions: -1 }],
    [{ ...rows[0], unitid: -1 }],
  ])
    assert.throws(() => validateData(bad, institutions, metadata));
});
test("inclusive filters apply field, level, year and institution together", () => {
  const f = { start: 2023, end: 2023, field: "11", level: "Bachelor's" };
  const result = filterRows(rows, f, 145600);
  assert.ok(result.length > 0);
  assert.ok(
    result.every(
      (r) =>
        r.year === 2023 &&
        r.field_family === "11" &&
        r.award_level === "Bachelor's" &&
        r.unitid === 145600,
    ),
  );
  assert.equal(
    sum(result),
    rows
      .filter(
        (r) =>
          r.unitid === 145600 &&
          r.year === 2023 &&
          r.field_family === "11" &&
          r.award_level === "Bachelor's",
      )
      .reduce((t, r) => t + r.completions, 0),
  );
});
test("missing years remain null, reported zero remains zero", () =>
  assert.deepEqual(byYear([{ year: 2020, completions: 0 }], 2020, 2021), [
    { year: 2020, completions: 0 },
    { year: 2021, completions: null },
  ]));
test("hand calculation: 100 to 121 over two intervals", () => {
  const r = growth(100, 121, 2);
  assert.ok(Math.abs(r.change - 21) < 1e-10);
  assert.ok(Math.abs(r.cagr - 10) < 1e-10);
});
test("undefined growth and zero endpoint are distinguished", () => {
  for (const args of [
    [0, 5, 2],
    [null, 5, 2],
    [5, null, 2],
    [5, 5, 0],
  ])
    assert.deepEqual(growth(...args), { change: null, cagr: null });
  assert.deepEqual(growth(5, 0, 2), { change: -100, cagr: -100 });
});
test("summaries count awards, not records or directory institutions", () => {
  const s = summary(
    [
      { year: 2020, unitid: 1, completions: 10 },
      { year: 2020, unitid: 1, completions: 20 },
      { year: 2020, unitid: 2, completions: 0 },
    ],
    2020,
    2020,
  );
  assert.equal(s.total, 30);
  assert.equal(s.institutions, 1);
});
test("category groups preserve total", () =>
  assert.equal(
    sum(groupTotals(rows, "field_family", "field_name")),
    sum(rows),
  ));
test("all 1008 region filter combinations have consistent totals or explicit empty series", () => {
  let count = 0;
  for (const field of ["all", ...metadata.fields.map((f) => f.code)])
    for (const level of ["all", ...metadata.award_levels])
      for (const start of metadata.years)
        for (const end of metadata.years.filter((y) => y >= start)) {
          const subset = filterRows(rows, { field, level, start, end });
          const series = byYear(subset, start, end);
          assert.equal(
            sum(series.filter((s) => s.completions != null)),
            sum(subset),
          );
          if (!subset.length)
            assert.ok(series.every((s) => s.completions === null));
          count++;
        }
  assert.equal(count, 1008);
});
