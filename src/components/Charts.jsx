import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { trendAxis, institutionShares } from "../chartData.js";
import { formatNumber } from "../data.js";

const colors = [
  "#087f8c",
  "#b65b19",
  "#5966a3",
  "#218258",
  "#8d5292",
  "#827128",
];
const shortNumber = (n) =>
  Math.abs(n) >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : n;
const shortNames = {
  "Computer & information sciences": "Computer science",
  "Biological & biomedical sciences": "Biology & biomedicine",
  "Mathematics & statistics": "Math & statistics",
  "Engineering technologies": "Engineering tech.",
};

export function EmptyState({ children }) {
  return (
    <div className="empty" role="status">
      <span className="empty-symbol" aria-hidden="true">
        ∅
      </span>
      <h3>No matching records</h3>
      <p>
        {children ||
          "Try another field, degree level, year range, or institution."}
      </p>
      <small>Missing records are not treated as zero awards.</small>
    </div>
  );
}

function ValuesTable({ data, year = false }) {
  return (
    <details className="values-table">
      <summary>View accessible data table</summary>
      <div className="table-scroll">
        <table>
          <caption>
            {year ? "Degrees awarded by year" : "Degrees awarded by category"}
          </caption>
          <thead>
            <tr>
              <th scope="col">{year ? "Award year" : "Category"}</th>
              <th scope="col">Degrees awarded</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={year ? d.year : d.key}>
                <th scope="row">{year ? d.year : d.name}</th>
                <td>
                  {d.completions == null
                    ? "No records"
                    : formatNumber(d.completions)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function TrendChart({
  data,
  title = "Degrees awarded over time",
  subtitle,
}) {
  const [fromZero, setFromZero] = React.useState(false);
  const reported = data.filter((d) => d.completions != null);
  const hasData = reported.length > 0;
  const axis = trendAxis(data, fromZero);
  const first = reported[0],
    last = reported.at(-1);
  const delta = hasData ? last.completions - first.completions : 0;
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">THE LONG VIEW</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <span className="chart-key">
          <i />
          Degrees awarded
        </span>
      </div>
      {hasData ? (
        <>
          <p className="trend-reading">
            {reported.length === 1
              ? `${first.year}: ${formatNumber(first.completions)} awards. One year has reported data.`
              : `${first.year}: ${formatNumber(first.completions)} → ${last.year}: ${formatNumber(last.completions)} awards. ${delta === 0 ? "No net change" : (delta > 0 ? "Up " : "Down ") + formatNumber(Math.abs(delta)) + " awards"}${first.completions > 0 && delta !== 0 ? " (" + ((Math.abs(delta) / first.completions) * 100).toFixed(1) + "%)" : ""}.`}
          </p>
          <div className="axis-controls">
            <label>
              Vertical scale{" "}
              <select
                value={fromZero ? "zero" : "fit"}
                onChange={(e) => setFromZero(e.target.value === "zero")}
              >
                <option value="fit">Fit to selected values</option>
                <option value="zero">Start at zero</option>
              </select>
            </label>
            <small>
              {formatNumber(axis.domain[0])}–{formatNumber(axis.domain[1])}{" "}
              awards
            </small>
          </div>
          <div
            className="chart-wrap"
            role="img"
            aria-label={`${title}. Exact values are available in the table below.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 28, left: 10 }}
                accessibilityLayer
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#e5ebe8"
                  strokeDasharray="3 4"
                />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Award year",
                    position: "bottom",
                    offset: 12,
                  }}
                  minTickGap={12}
                />
                <YAxis
                  domain={axis.domain}
                  ticks={axis.ticks}
                  tickFormatter={formatNumber}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={52}
                  label={{
                    value: "Degrees",
                    angle: -90,
                    position: "insideLeft",
                    offset: 0,
                  }}
                />
                <Tooltip
                  formatter={(v) => [formatNumber(v), "Degrees awarded"]}
                  labelFormatter={(v) => `Award year ${v}`}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #d8e3df",
                  }}
                />
                <Line
                  type="linear"
                  dataKey="completions"
                  stroke="#087f8c"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ValuesTable data={data} year />
        </>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

export function BreakdownChart({
  data,
  title = "Where degrees are awarded",
  subtitle,
}) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">FIELD BREAKDOWN</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {data.length ? (
        <>
          <div
            className="chart-wrap breakdown"
            role="img"
            aria-label={`${title}. Exact values are available in the table below.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 10, right: 35, bottom: 25, left: 0 }}
                accessibilityLayer
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="#e5ebe8"
                  strokeDasharray="3 4"
                />
                <XAxis
                  type="number"
                  tickFormatter={shortNumber}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Degrees awarded",
                    position: "bottom",
                    offset: 10,
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={132}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => shortNames[v] || v}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v) => [formatNumber(v), "Degrees awarded"]}
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #d8e3df",
                  }}
                />
                <Bar
                  dataKey="completions"
                  radius={[0, 5, 5, 0]}
                  maxBarSize={32}
                  isAnimationActive={false}
                >
                  {data.map((d, i) => (
                    <Cell key={d.key} fill={colors[i % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ValuesTable data={data} />
        </>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

export function InstitutionShare({ ranked, onSelect }) {
  const slices = institutionShares(ranked);
  const total = slices.reduce((n, item) => n + item.completions, 0);
  const percent = (n) =>
    new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(n / total);
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">INSTITUTIONS</p>
          <h2>Share of degrees awarded</h2>
          <p>
            Each slice shows an institution’s share of all awards matching your
            filters.
          </p>
        </div>
      </div>
      {total > 0 ? (
        <>
          <div className="share-figure" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="completions"
                  nameKey="name"
                  innerRadius="64%"
                  outerRadius="90%"
                  startAngle={90}
                  endAngle={-270}
                  isAnimationActive={false}
                >
                  {slices.map((s, i) => (
                    <Cell key={s.key} fill={colors[i]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    formatNumber(value) + " awards",
                    "Total",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <span className="share-total">
              <strong>{formatNumber(total)}</strong>awards
            </span>
          </div>
          <ul className="share-list">
            {slices.map((item, i) => (
              <li key={item.key}>
                <i aria-hidden="true" style={{ background: colors[i] }} />
                {item.key === "other" ? (
                  <span>{item.name}</span>
                ) : (
                  <button onClick={() => onSelect(item.key)}>
                    {item.name}
                  </button>
                )}
                <span>
                  {formatNumber(item.completions)} ·{" "}
                  <strong>{percent(item.completions)}</strong>
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>
          {ranked.length
            ? "The selected institutions reported zero awards."
            : "No institutions match these filters."}
        </p>
      )}
    </section>
  );
}
