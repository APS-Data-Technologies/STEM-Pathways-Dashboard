import test from "node:test";
import assert from "node:assert/strict";
import { trendAxis, institutionShares } from "../src/chartData.js";
import { defaultFilters } from "../src/data.js";
const series = (...counts) => counts.map((completions) => ({ completions }));
test("a narrow trend has a focused axis and an optional zero baseline", () => {
  const data = series(224, null, 233);
  const { domain, ticks } = trendAxis(data);
  assert.ok(
    domain[0] > 200 && domain[0] <= 224 && domain[1] >= 233 && domain[1] < 250,
  );
  assert.ok(ticks.every(Number.isInteger));
  assert.equal(trendAxis(data, true).domain[0], 0);
});
test("zero, single, constant and missing series have a nonnegative usable axis", () => {
  for (const data of [
    series(0),
    series(null, null),
    series(233),
    series(10, 10),
  ]) {
    const {
      domain: [a, b],
    } = trendAxis(data);
    assert.ok(
      a >= 0 &&
        b > a &&
        data.every(
          (v) =>
            v.completions === null ||
            (a <= v.completions && b >= v.completions),
        ),
    );
  }
});
test("institution shares include the whole denominator and distinguish zero totals", () => {
  const data = [12, 10, 8, 7, 4, 3, 0].map((completions, key) => ({
    key,
    completions,
  }));
  const result = institutionShares(data);
  assert.equal(result.at(-1).completions, 7);
  assert.equal(
    result.reduce((n, r) => n + r.completions, 0),
    44,
  );
  assert.deepEqual(institutionShares([{ completions: 0 }]), []);
});
test("advisors start with the five most recent award years", () => {
  const f = defaultFilters({
    years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
  });
  assert.deepEqual([f.start, f.end], [2021, 2025]);
});
