// Round outwards in whole awards, leaving space above and below the series.
export function trendAxis(data, fromZero = false) {
  const counts = data.map((row) => row.completions).filter(Number.isFinite);
  if (!counts.length) return { domain: [0, 4], ticks: [0, 1, 2, 3, 4] };
  const low = Math.min(...counts),
    high = Math.max(...counts);
  const padding = Math.max(1, (high - low) * 0.12, high * 0.01);
  const bottom = fromZero ? 0 : Math.max(0, low - padding);
  const top = high + padding;
  const target = Math.max(1, (top - bottom) / 4);
  const magnitude = 10 ** Math.floor(Math.log10(target));
  const step = [1, 2, 5, 10].map((n) => n * magnitude).find((n) => n >= target);
  const min = Math.floor(bottom / step) * step;
  const max = Math.ceil(top / step) * step;
  const ticks = [];
  for (let tick = min; tick <= max; tick += step) ticks.push(tick);
  return { domain: [min, max], ticks };
}

export function institutionShares(ranked) {
  const positive = ranked.filter((row) => row.completions > 0);
  const shown = positive.slice(0, 4);
  const rest = positive.slice(4);
  if (rest.length === 1) shown.push(rest[0]);
  if (rest.length > 1)
    shown.push({
      key: "other",
      name: "All other institutions",
      completions: rest.reduce((sum, row) => sum + row.completions, 0),
    });
  return shown;
}
