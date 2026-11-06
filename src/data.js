export const number = new Intl.NumberFormat("en-US");
export const formatNumber = (value) =>
  value == null ? "—" : number.format(value);
export const formatPercent = (value) =>
  value == null
    ? "Not available"
    : `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export function validateData(rows, institutions, metadata) {
  if (
    !Array.isArray(rows) ||
    !rows.length ||
    !Array.isArray(institutions) ||
    !metadata ||
    !Array.isArray(metadata.years) ||
    !metadata.years.length ||
    !Array.isArray(metadata.fields) ||
    !Array.isArray(metadata.award_levels)
  )
    throw new Error("The data files do not match the expected format.");
  const ids = new Set(institutions.map((i) => i.unitid));
  const families = new Set(metadata.fields.map((f) => f.code));
  const keys = new Set();
  for (const row of rows) {
    const key = [row.year, row.unitid, row.field_family, row.award_level].join(
      "|",
    );
    if (
      !Number.isInteger(row.completions) ||
      row.completions < 0 ||
      !ids.has(row.unitid) ||
      !families.has(row.field_family) ||
      !metadata.years.includes(row.year) ||
      !metadata.award_levels.includes(row.award_level) ||
      keys.has(key)
    )
      throw new Error("The dataset contains an invalid or duplicate record.");
    keys.add(key);
  }
  return { rows, institutions, metadata };
}

export async function loadData(signal) {
  const files = ["completions", "institutions", "metadata"];
  const payloads = await Promise.all(
    files.map(async (file) => {
      const response = await fetch(
        `${import.meta.env.BASE_URL}data/${file}.json`,
        { signal },
      );
      if (!response.ok)
        throw new Error(`Unable to load ${file} (${response.status}).`);
      try {
        return await response.json();
      } catch (error) {
        if (error.name === "AbortError") throw error;
        throw new Error("A data file could not be read. Please try again.");
      }
    }),
  );
  return validateData(...payloads);
}

export function filterRows(rows, filters, institution = null) {
  return rows.filter(
    (r) =>
      r.year >= filters.start &&
      r.year <= filters.end &&
      (filters.field === "all" || r.field_family === filters.field) &&
      (filters.level === "all" || r.award_level === filters.level) &&
      (institution == null || r.unitid === Number(institution)),
  );
}

export function sum(rows) {
  return rows.reduce((total, r) => total + r.completions, 0);
}

export function byYear(rows, start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => {
    const year = start + i,
      matches = rows.filter((r) => r.year === year);
    return { year, completions: matches.length ? sum(matches) : null };
  });
}

export function groupTotals(rows, key, label = key) {
  const groups = new Map();
  rows.forEach((r) => {
    if (!groups.has(r[key]))
      groups.set(r[key], { key: r[key], name: r[label], completions: 0 });
    groups.get(r[key]).completions += r.completions;
  });
  return [...groups.values()].sort(
    (a, b) =>
      b.completions - a.completions ||
      String(a.name).localeCompare(String(b.name)),
  );
}

export function growth(startValue, endValue, intervals) {
  if (
    startValue == null ||
    endValue == null ||
    startValue <= 0 ||
    intervals <= 0
  )
    return { change: null, cagr: null };
  return {
    change: (endValue / startValue - 1) * 100,
    cagr: ((endValue / startValue) ** (1 / intervals) - 1) * 100,
  };
}

export function summary(rows, start, end) {
  const series = byYear(rows, start, end);
  return {
    total: sum(rows),
    institutions: new Set(
      rows.filter((r) => r.completions > 0).map((r) => r.unitid),
    ).size,
    ...growth(series[0]?.completions, series.at(-1)?.completions, end - start),
  };
}
