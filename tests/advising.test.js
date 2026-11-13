import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  filterRows,
  defaultFilters,
  readSelection,
  selectionSearch,
  rowsToCsv,
  fieldGrowth,
  sum,
} from "../src/data.js";
const read = (n) =>
  JSON.parse(
    readFileSync(new URL(`../public/data/${n}.json`, import.meta.url)),
  );
const data = {
  rows: read("completions"),
  institutions: read("institutions"),
  metadata: read("metadata"),
};
test("city and control filters reproduce a known local advising selection", () => {
  const f = {
    ...defaultFilters(data.metadata),
    field: "11",
    level: "Bachelor's",
    start: 2023,
    city: "Chicago",
    control: "Public",
  };
  const rows = filterRows(data.rows, f);
  assert.equal(sum(rows), 566);
  assert.equal(rows.length, 3);
  assert.equal(
    sum(rows.filter((r) => [144005, 145600].includes(r.unitid))),
    463,
  );
});
test("city and control partitions reconcile to full annual totals", () => {
  for (const year of data.metadata.years) {
    const f = { ...defaultFilters(data.metadata), start: year, end: year };
    const expected = sum(filterRows(data.rows, f));
    assert.equal(
      data.metadata.cities.reduce(
        (n, city) => n + sum(filterRows(data.rows, { ...f, city })),
        0,
      ),
      expected,
    );
    assert.equal(
      data.metadata.controls.reduce(
        (n, control) => n + sum(filterRows(data.rows, { ...f, control })),
        0,
      ),
      expected,
    );
  }
});
test("saved selection survives round trip including comparison IDs", () => {
  const filters = {
    ...defaultFilters(data.metadata),
    field: "11",
    level: "Bachelor's",
    city: "Chicago",
    control: "Public",
    start: 2023,
  };
  const selected = "145600",
    compare = ["144005", "145600"];
  assert.deepEqual(
    readSelection(selectionSearch(filters, selected, compare), data),
    { filters, selected, compare },
  );
});
test("invalid URL values normalize safely and comparisons are deduplicated and capped", () => {
  const r = readSelection(
    "?field=99&level=bad&city=bad&control=bad&start=2023&end=2016&institution=-2&compare=144005,144005,145600,146339,147767,-2",
    data,
  );
  assert.equal(r.filters.field, "all");
  assert.equal(r.filters.start, 2016);
  assert.equal(r.filters.end, 2023);
  assert.equal(r.compare.length, 3);
  assert.equal(r.selected, "146339");
});
test("CSV preserves text and prevents spreadsheet formulas, including empty output", () => {
  const csv = rowsToCsv([
    {
      year: 2023,
      unitid: 1,
      institution: "=SUM(1,2)",
      city: 'Town "A"',
      control: "Public",
      field_family: "11",
      field_name: "Computing",
      award_level: "Bachelor's",
      completions: 9,
    },
  ]);
  assert.ok(csv.includes('"\'=SUM(1,2)"'));
  assert.ok(csv.includes('"Town ""A"""'));
  assert.equal(rowsToCsv([]).split("\r\n").length, 2);
});
test("growth sorting excludes unavailable baselines from the top", () => {
  const rows = [
    { year: 2020, field_family: "11", field_name: "A", completions: 10 },
    { year: 2023, field_family: "11", field_name: "A", completions: 20 },
    { year: 2023, field_family: "14", field_name: "B", completions: 1000 },
  ];
  const result = fieldGrowth(rows, { start: 2020, end: 2023 });
  assert.equal(result[0].key, "11");
  assert.equal(result[0].change, 100);
  assert.equal(result[1].change, null);
});
