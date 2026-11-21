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
  degreeComparison,
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
    end: 2023,
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
    field: ["11"],
    level: ["Bachelor's"],
    city: ["Chicago"],
    control: ["Public"],
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

test("multiple filters select alternatives within groups and intersect groups without duplicate awards", () => {
  const f = {
    ...defaultFilters(data.metadata),
    field: ["11", "14"],
    level: ["Bachelor's", "Master's"],
    city: ["Chicago", "Evanston"],
    control: ["Public", "Private nonprofit"],
  };
  const rows = filterRows(data.rows, f);
  const independentlySelected = data.rows.filter(
    (r) =>
      r.year >= f.start &&
      r.year <= f.end &&
      f.field.includes(r.field_family) &&
      f.level.includes(r.award_level) &&
      f.city.includes(r.city) &&
      f.control.includes(r.control),
  );
  assert.deepEqual(rows, independentlySelected);
  assert.ok(rows.length);
  assert.deepEqual(
    readSelection(selectionSearch(f, "145600", []), data).filters,
    f,
  );
  const legacy = readSelection(
    "?field=11&level=Bachelor%27s&city=Chicago",
    data,
  );
  assert.deepEqual(legacy.filters.level, ["Bachelor's"]);
  assert.deepEqual(
    readSelection("?field=11&field=11&field=bad&field=14", data).filters.field,
    ["11", "14"],
  );
});

test("college degree matrix separates levels, sums years and keeps zero distinct from no record", () => {
  const fields = [
    { code: "11", name: "Computing" },
    { code: "14", name: "Engineering" },
  ];
  const levels = ["Bachelor's", "Master's"];
  const rows = [
    { field_family: "11", award_level: levels[0], completions: 3 },
    { field_family: "11", award_level: levels[0], completions: 4 },
    { field_family: "14", award_level: levels[1], completions: 0 },
  ];
  assert.deepEqual(
    degreeComparison(rows, fields, levels).map((r) => r.counts),
    [
      [7, null],
      [null, 0],
    ],
  );
  const filters = {
    ...defaultFilters(data.metadata),
    field: ["11", "14"],
    level: levels,
  };
  const institutionRows = filterRows(data.rows, filters, "145600");
  const counts = degreeComparison(institutionRows, fields, levels).flatMap(
    (r) => r.counts,
  );
  assert.ok(counts.every((n) => n > 0));
  assert.equal(
    counts.reduce((a, b) => a + b, 0),
    sum(institutionRows),
  );
});
