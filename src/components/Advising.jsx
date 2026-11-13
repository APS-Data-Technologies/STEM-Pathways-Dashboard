import React, { useMemo, useState } from "react";
import {
  byYear,
  groupTotals,
  summary,
  formatNumber,
  formatPercent,
  sum,
} from "../data.js";
import { TrendChart, EmptyState } from "./Charts.jsx";

export function Findings({ rows, filters }) {
  if (!rows.length) return null;
  const total = sum(rows),
    fields = groupTotals(rows, "field_family", "field_name"),
    levels = groupTotals(rows, "award_level");
  const trend = byYear(rows, filters.start, filters.end),
    latest = trend.at(-1);
  return (
    <section className="panel findings">
      <p className="eyebrow">FOR YOUR ADVISING CONVERSATION</p>
      <h2>What this selection tells us</h2>
      <ul>
        <li>
          <strong>{formatNumber(total)} degrees</strong> were awarded in the
          selected period and categories.
        </li>
        <li>
          <strong>{fields[0].name}</strong> has the largest total:{" "}
          {formatNumber(fields[0].completions)} (
          {total ? ((100 * fields[0].completions) / total).toFixed(1) : "0.0"}%
          of this selection; ties may occur).
        </li>
        <li>
          <strong>{levels[0].name}</strong> has the largest degree-level total:{" "}
          {formatNumber(levels[0].completions)}.
        </li>
        <li>
          The final selected year, <strong>{latest.year}</strong>, has{" "}
          {latest.completions == null
            ? "no matching records"
            : `${formatNumber(latest.completions)} degrees awarded`}
          .
        </li>
      </ul>
      <p>
        Use these counts to explore programs and institutions. They do not
        measure admission chances, program quality, student success rates or job
        prospects.
      </p>
    </section>
  );
}

export function Compare({ data, rows, filters, selected, setSelected }) {
  const [search, setSearch] = useState("");
  const totals = useMemo(
    () =>
      new Map(
        groupTotals(rows, "unitid", "institution").map((x) => [
          String(x.key),
          x.completions,
        ]),
      ),
    [rows],
  );
  const options = data.institutions.filter(
    (i) =>
      totals.has(String(i.unitid)) &&
      `${i.name} ${i.city}`.toLowerCase().includes(search.toLowerCase()),
  );
  function toggle(id) {
    setSelected((ids) =>
      ids.includes(id)
        ? ids.filter((x) => x !== id)
        : ids.length < 3
          ? [...ids, id]
          : ids,
    );
  }
  const chosen = selected
    .map((id) => data.institutions.find((i) => String(i.unitid) === id))
    .filter(Boolean);
  return (
    <>
      <section className="panel">
        <p className="eyebrow">BUILD A SHORTLIST</p>
        <h2>Compare up to three institutions</h2>
        <p>
          Select institutions with matching records. All comparisons use the
          same filters. Counts reflect institution size and subject mix; they
          are not quality rankings.
        </p>
        <label>
          Find an institution to compare
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or city"
          />
        </label>
        <div className="shortlist" aria-label="Selected institutions">
          {chosen.map((i) => (
            <button key={i.unitid} onClick={() => toggle(String(i.unitid))}>
              Remove {i.name} ×
            </button>
          ))}
        </div>
        <p role="status">
          {selected.length} of 3 selected · {options.length} matching
          institutions
        </p>
        <div className="comparison-options">
          {options.map((i) => (
            <label key={i.unitid}>
              <input
                type="checkbox"
                checked={selected.includes(String(i.unitid))}
                disabled={
                  selected.length >= 3 && !selected.includes(String(i.unitid))
                }
                onChange={() => toggle(String(i.unitid))}
              />
              <span>
                {i.name}
                <small>
                  {i.city} · {formatNumber(totals.get(String(i.unitid)))} awards
                </small>
              </span>
            </label>
          ))}
        </div>
      </section>
      {chosen.length ? (
        <>
          <section className="panel">
            <h2>Your comparison</h2>
            <div className="table-scroll">
              <table>
                <caption>Same period and filters for every institution</caption>
                <thead>
                  <tr>
                    <th>Institution</th>
                    <th>Total awards</th>
                    <th>{filters.start}</th>
                    <th>{filters.end}</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {chosen.map((i) => {
                    const rr = rows.filter((r) => r.unitid === i.unitid),
                      series = byYear(rr, filters.start, filters.end),
                      s = summary(rr, filters.start, filters.end);
                    return (
                      <tr key={i.unitid}>
                        <th scope="row">{i.name}</th>
                        <td>
                          {rr.length ? formatNumber(s.total) : "No records"}
                        </td>
                        <td>{formatNumber(series[0].completions)}</td>
                        <td>{formatNumber(series.at(-1).completions)}</td>
                        <td>{formatPercent(s.change)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p>
              Separate trend charts use their own vertical scales. Compare exact
              counts in the table above. A saved institution may show no records
              after filters change.
            </p>
          </section>
          <div className="comparison-trends">
            {chosen.map((i) => (
              <TrendChart
                key={i.unitid}
                title={i.name}
                subtitle="Degrees awarded with the current filters"
                data={byYear(
                  rows.filter((r) => r.unitid === i.unitid),
                  filters.start,
                  filters.end,
                )}
              />
            ))}
          </div>
        </>
      ) : (
        <section className="panel">
          <h2>Choose institutions above to begin</h2>
          <p>Try a local public college alongside a nearby university.</p>
        </section>
      )}
    </>
  );
}

export function InstitutionMap({ data, rows, onSelect }) {
  const [active, setActive] = useState(null),
    [search, setSearch] = useState("");
  const totals = new Map(
    groupTotals(rows, "unitid", "institution")
      .filter((i) => i.completions > 0)
      .map((i) => [i.key, i.completions]),
  );
  const matches = data.institutions.filter((i) => totals.has(i.unitid));
  const listMatches = matches.filter((i) =>
    `${i.name} ${i.city}`.toLowerCase().includes(search.toLowerCase()),
  );
  const located = matches.filter(
    (i) =>
      i.latitude >= 36.9 &&
      i.latitude <= 42.6 &&
      i.longitude >= -91.6 &&
      i.longitude <= -87.3,
  );
  const chosen = located.find((i) => i.unitid === active);
  const x = (lon) => 55 + ((lon + 91.6) / 4.3) * 390,
    y = (lat) => 35 + ((42.6 - lat) / 5.7) * 570;
  return (
    <section className="panel">
      <p className="eyebrow">EXPLORE LOCATIONS</p>
      <h2>Illinois institution map</h2>
      <p>
        Institutions with positive awards in your selection. Locations use the
        latest directory record in the snapshot, not a campus-by-campus
        inventory. Equal-size dots do not indicate award volume. Searching the
        list keeps all filtered institutions on the map.
      </p>
      <label>
        Search the institution list
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Institution or city"
        />
      </label>
      {matches.length ? (
        <div className="map-layout">
          <div>
            <svg
              viewBox="0 0 500 660"
              className="institution-map"
              role="img"
              aria-label="Geographic plot of Illinois institutions. Use the institution list for keyboard access and exact totals."
            >
              <rect
                x="50"
                y="25"
                width="410"
                height="590"
                rx="8"
                fill="#eef4ed"
              />
              {[37, 38, 39, 40, 41, 42].map((lat) => (
                <g key={lat}>
                  <line
                    x1="50"
                    x2="460"
                    y1={y(lat)}
                    y2={y(lat)}
                    stroke="#d5dfd4"
                  />
                  <text x="5" y={y(lat) + 4}>
                    {lat}°N
                  </text>
                </g>
              ))}
              {[-91, -90, -89, -88].map((lon) => (
                <g key={lon}>
                  <line
                    x1={x(lon)}
                    x2={x(lon)}
                    y1="25"
                    y2="615"
                    stroke="#d5dfd4"
                  />
                  <text x={x(lon) - 20} y="640">
                    {Math.abs(lon)}°W
                  </text>
                </g>
              ))}
              {located.map((i) => (
                <circle
                  key={i.unitid}
                  cx={x(i.longitude)}
                  cy={y(i.latitude)}
                  r={active === i.unitid ? 7 : 4}
                  fill={active === i.unitid ? "#a84a18" : "#087f8c"}
                  stroke="white"
                  strokeWidth="1"
                  onMouseEnter={() => setActive(i.unitid)}
                  onClick={() => onSelect(i.unitid)}
                >
                  <title>
                    {i.name}: {formatNumber(totals.get(i.unitid))} degrees
                  </title>
                </circle>
              ))}
            </svg>
            <p className="map-detail" aria-live="polite">
              {chosen
                ? `${chosen.name} · ${chosen.city} · ${formatNumber(totals.get(chosen.unitid))} degrees`
                : "Hover a dot for details. Select a name to open its institution view."}
            </p>
          </div>
          <div>
            <p>
              {located.length} plotted · {matches.length - located.length}{" "}
              without usable Illinois coordinates
            </p>
            <ol className="map-list">
              {listMatches.map((i) => (
                <li key={i.unitid}>
                  <button
                    onMouseEnter={() => setActive(i.unitid)}
                    onFocus={() => setActive(i.unitid)}
                    onClick={() => onSelect(i.unitid)}
                  >
                    {i.name}
                  </button>
                  <span>
                    {i.city} · {formatNumber(totals.get(i.unitid))} awards
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
      <p>
        Source: NCES IPEDS institution directories. This geographic plot has
        latitude/longitude reference lines and no external map service.
        Institutions at the same coordinates may overlap; every matching
        institution remains in the list.
      </p>
    </section>
  );
}
