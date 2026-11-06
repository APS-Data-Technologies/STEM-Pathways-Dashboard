import React, { useEffect, useMemo, useState } from "react";
import {
  loadData,
  filterRows,
  byYear,
  groupTotals,
  summary,
  formatNumber,
  formatPercent,
  growth,
} from "./data.js";
import {
  TrendChart,
  BreakdownChart,
  EmptyState,
} from "./components/Charts.jsx";

const pages = [
  ["overview", "Overview"],
  ["fields", "STEM fields"],
  ["institutions", "Institutions"],
  ["about", "About the data"],
];
function currentPage() {
  const hash = window.location.hash.slice(1);
  return pages.some(([p]) => p === hash) ? hash : "overview";
}

function Filters({ metadata, filters, setFilters }) {
  function change(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }
  return (
    <section className="filters" aria-label="Dashboard filters">
      <div className="filter-intro">
        <span className="filter-icon" aria-hidden="true">
          ☷
        </span>
        <strong>Explore the data</strong>
        <small>All charts follow your selections</small>
      </div>
      <label>
        STEM field
        <select
          value={filters.field}
          onChange={(e) => change("field", e.target.value)}
        >
          <option value="all">All STEM fields</option>
          {metadata.fields.map((f) => (
            <option key={f.code} value={f.code}>
              {f.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Degree level
        <select
          value={filters.level}
          onChange={(e) => change("level", e.target.value)}
        >
          <option value="all">All degree levels</option>
          {metadata.award_levels.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </label>
      <label>
        From year
        <select
          value={filters.start}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              start: +e.target.value,
              end: Math.max(f.end, +e.target.value),
            }))
          }
        >
          {metadata.years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </label>
      <label>
        Through year
        <select
          value={filters.end}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              end: +e.target.value,
              start: Math.min(f.start, +e.target.value),
            }))
          }
        >
          {metadata.years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </label>
      <button
        className="reset"
        onClick={() =>
          setFilters({
            field: "all",
            level: "all",
            start: metadata.years[0],
            end: metadata.years.at(-1),
          })
        }
      >
        Reset
      </button>
    </section>
  );
}

function Metrics({ rows, filters }) {
  const s = summary(rows, filters.start, filters.end);
  const metrics = [
    [
      "Degrees awarded",
      rows.length ? formatNumber(s.total) : "—",
      `${filters.start}–${filters.end} selected-period total`,
    ],
    [
      "Change across period",
      formatPercent(s.change),
      `${filters.start} → ${filters.end}; same selection`,
    ],
    ["Annualized growth", formatPercent(s.cagr), "Compound annual growth rate"],
    [
      "Institutions with awards",
      formatNumber(s.institutions),
      "At least one matching award",
    ],
  ];
  return (
    <div className="metrics" aria-live="polite">
      {metrics.map(([label, value, hint], i) => (
        <section key={label} className={`metric metric-${i}`}>
          <p>{label}</p>
          <strong>{value}</strong>
          <small>{hint}</small>
        </section>
      ))}
    </div>
  );
}

function Institutions({ data, filters, selected, setSelected }) {
  const [search, setSearch] = useState("");
  const choices = data.institutions.filter((i) =>
    `${i.name} ${i.city}`.toLowerCase().includes(search.toLowerCase()),
  );
  const institution = data.institutions.find(
    (i) => i.unitid === Number(selected),
  );
  const rows = useMemo(
    () => filterRows(data.rows, filters, selected),
    [data.rows, filters, selected],
  );
  return (
    <>
      <section className="panel institution-picker">
        <div>
          <p className="eyebrow">TAKE A CLOSER LOOK</p>
          <h2>Explore an institution</h2>
          <p>
            Includes all Illinois institutions in the source directories, even
            those without matching awards.
          </p>
        </div>
        <div className="picker-fields">
          <label>
            Search by name or city
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Judson or Chicago"
            />
          </label>
          <label>
            Choose an institution
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {!choices.some((i) => i.unitid === Number(selected)) &&
                institution && (
                  <option value={institution.unitid}>
                    {institution.name} (selected)
                  </option>
                )}
              {choices.map((i) => (
                <option key={i.unitid} value={i.unitid}>
                  {i.name} — {i.city}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p role="status">{choices.length} institutions match your search.</p>
      </section>
      {institution && (
        <div className="institution-title">
          <span className="institution-mark" aria-hidden="true">
            ▥
          </span>
          <div>
            <h2>{institution.name}</h2>
            <p>
              {institution.city}, Illinois · IPEDS ID {institution.unitid} ·
              Latest directory record: {institution.directory_year}
            </p>
          </div>
        </div>
      )}
      <Metrics rows={rows} filters={filters} />
      {!rows.length ? (
        <section className="panel">
          <EmptyState>
            This institution has no matching records for the selected period,
            field, and degree level.
          </EmptyState>
        </section>
      ) : (
        <div className="chart-grid">
          <TrendChart
            data={byYear(rows, filters.start, filters.end)}
            title="Institution trend"
            subtitle="Degrees awarded in the selected STEM fields"
          />
          <BreakdownChart
            data={groupTotals(rows, "field_family", "field_name")}
            title="Institution field mix"
            subtitle="Total awards across the selected years"
          />
        </div>
      )}
    </>
  );
}

function Fields({ rows, filters }) {
  const fields = groupTotals(rows, "field_family", "field_name");
  return (
    <>
      <BreakdownChart
        data={fields}
        title="Compare STEM fields"
        subtitle={`Selected degree levels · ${filters.start}–${filters.end} totals`}
      />
      <section className="panel">
        <p className="eyebrow">GROWTH, WITH CONTEXT</p>
        <h2>Which fields changed fastest?</h2>
        <p>
          Percent change uses the first and last selected years. A missing or
          zero baseline is not ranked.
        </p>
        {fields.length ? (
          <div className="table-scroll">
            <table>
              <caption>Field totals and endpoint growth</caption>
              <thead>
                <tr>
                  <th>STEM field</th>
                  <th>{filters.start}</th>
                  <th>{filters.end}</th>
                  <th>Change</th>
                  <th>Annualized</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f) => {
                  const trend = byYear(
                      rows.filter((r) => r.field_family === f.key),
                      filters.start,
                      filters.end,
                    ),
                    a = trend[0].completions,
                    b = trend.at(-1).completions,
                    g = growth(a, b, filters.end - filters.start);
                  return (
                    <tr key={f.key}>
                      <th scope="row">{f.name}</th>
                      <td>{formatNumber(a)}</td>
                      <td>{formatNumber(b)}</td>
                      <td>{formatPercent(g.change)}</td>
                      <td>{formatPercent(g.cagr)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </>
  );
}

function About({ metadata }) {
  return (
    <div className="about-grid">
      <section className="panel prose">
        <p className="eyebrow">SOURCE & METHOD</p>
        <h2>Know what the numbers mean.</h2>
        <p>
          This dashboard describes <strong>degrees awarded</strong> at Illinois
          institutions. It does not track individual students, enrollment,
          employment, or a student's journey from K–12 to college.
        </p>
        <dl>
          <dt>Source</dt>
          <dd>
            <a
              href="https://nces.ed.gov/ipeds/"
              target="_blank"
              rel="noreferrer"
            >
              National Center for Education Statistics · IPEDS →
            </a>
          </dd>
          <dt>Period</dt>
          <dd>
            {metadata.years[0]}–{metadata.years.at(-1)} award years. Each year
            ends June 30; e.g. 2023 means July 1, 2022–June 30, 2023.
          </dd>
          <dt>Region</dt>
          <dd>Illinois, determined using each year's institution directory.</dd>
          <dt>Degree levels</dt>
          <dd>
            Associate, bachelor's, and master's. Certificates and doctoral
            awards are excluded.
          </dd>
          <dt>Counting rule</dt>
          <dd>
            {metadata.counting_rule}. First-major counting reduces duplicate
            major reporting; it does not make the totals a unique-person count.
          </dd>
          <dt>Snapshot</dt>
          <dd>
            Downloaded {metadata.download_date}. Static files; no automatic
            refresh. {metadata.release_status}.
          </dd>
        </dl>
        <h3>Our working STEM definition</h3>
        <p>
          Six two-digit CIP families; this is a project definition, not a claim
          to include every federally designated STEM program.
        </p>
        <ul>
          {metadata.fields.map((f) => (
            <li key={f.code}>
              <strong>{f.code}</strong> — {f.name}
            </li>
          ))}
        </ul>
        <h3>How the data is prepared</h3>
        <ol>
          <li>
            Download unmodified annual Completions and institution-directory
            ZIPs.
          </li>
          <li>Select the revised Completions member and join on UNITID.</li>
          <li>
            Keep Illinois institutions, first majors, eligible degrees, and
            six-digit STEM detail rows.
          </li>
          <li>
            Aggregate to institution × year × field family × degree level, then
            validate and export.
          </li>
        </ol>
      </section>
      <aside>
        <section className="panel prose">
          <p className="eyebrow">READ BEFORE COMPARING</p>
          <h2>Limitations</h2>
          <ul>
            <li>{metadata.cip_handling}</li>
            <li>
              Institutions can open, close, rename, or merge. Institution names
              use the latest available directory record in the picker.
            </li>
            <li>{metadata.missing_data_rule}</li>
            <li>
              Totals can include NCES-imputed data. Published files may be
              revised later.
            </li>
            <li>
              A zero or missing baseline, or a single-year selection, has no
              reported growth rate.
            </li>
          </ul>
          <div className="method-note">
            <strong>Project scope</strong>
            <p>
              {metadata.scope_status}. Confirm the region, years, and definition
              with APS before presenting conclusions as approved findings.
            </p>
          </div>
        </section>
        <section className="panel prose">
          <h2>Trace the source</h2>
          <p>
            Every source file is recorded with its SHA-256 checksum in the
            repository.
          </p>
          <a
            href="https://github.com/APS-Data-Technologies/STEM-Pathways-Dashboard"
            target="_blank"
            rel="noreferrer"
          >
            View project on GitHub →
          </a>
          <details>
            <summary>Official source downloads</summary>
            <ul>
              {metadata.sources.map((s) => (
                <li key={s.filename}>
                  <a href={s.url}>{s.filename}</a>
                </li>
              ))}
            </ul>
          </details>
        </section>
      </aside>
    </div>
  );
}

function Dashboard({ data }) {
  const [page, setPage] = useState(currentPage);
  const [filters, setFilters] = useState({
    field: "all",
    level: "all",
    start: data.metadata.years[0],
    end: data.metadata.years.at(-1),
  });
  const [selected, setSelected] = useState(
    String(
      data.institutions.find((i) => i.name.includes("Judson"))?.unitid ||
        data.institutions[0].unitid,
    ),
  );
  useEffect(() => {
    const handler = () => setPage(currentPage());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const rows = useMemo(
    () => filterRows(data.rows, filters),
    [data.rows, filters],
  );
  const titles = {
    overview: [
      "See where STEM is heading.",
      "Explore the degrees shaping Illinois. Compare fields, follow trends, and take a closer look at the institutions behind the numbers.",
    ],
    fields: [
      "Six fields. A wider perspective.",
      "Compare STEM disciplines and understand how award counts changed over time.",
    ],
    institutions: [
      "Find the story behind a college.",
      "Explore degree completions at an individual Illinois institution.",
    ],
    about: [
      "Good decisions start with clear data.",
      "Sources, definitions, and limitations behind every number in this dashboard.",
    ],
  };
  const ranked = groupTotals(rows, "unitid", "institution").slice(0, 8);
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content").focus();
        }}
      >
        Skip to content
      </a>
      <header>
        <a className="brand" href="#overview">
          <span className="brand-symbol" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 19L19 4M5 4h14v14" />
            </svg>
          </span>
          <span>
            STEM<span className="brand-light">Pathways</span>
            <small>ILLINOIS DEGREE EXPLORER</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          {pages.map(([key, label]) => (
            <a
              key={key}
              href={`#${key}`}
              aria-current={page === key ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <span className="public-label">
          <i />
          Public data
        </span>
      </header>
      <main id="main-content" tabIndex={-1}>
        <section className="hero">
          <div>
            <div className="eyebrow">
              <span className="small-line" />
              APS DATA TECHNOLOGIES × JUDSON UNIVERSITY
            </div>
            <h1>{titles[page][0]}</h1>
            <p>{titles[page][1]}</p>
          </div>
          <div className="snapshot">
            <span>DATA SNAPSHOT</span>
            <strong>
              {data.metadata.years[0]}
              <span>—</span>
              {data.metadata.years.at(-1)}
            </strong>
            <small>NCES IPEDS · {data.metadata.region}</small>
          </div>
        </section>
        {page !== "about" && (
          <>
            <Filters
              metadata={data.metadata}
              filters={filters}
              setFilters={setFilters}
            />
            <div className="context-line">
              <span>
                {data.metadata.region} <b>·</b> {filters.start}–{filters.end}{" "}
                <b>·</b>{" "}
                {filters.level === "all" ? "All degree levels" : filters.level}
              </span>
              <span>{formatNumber(rows.length)} matching data records</span>
            </div>
            {filters.start < 2020 && filters.end >= 2020 && (
              <p className="classification-note">
                CIP classifications changed in 2020. Compare trends with this
                limitation in mind. <a href="#about">Read methodology →</a>
              </p>
            )}
          </>
        )}
        {page === "overview" && (
          <>
            <Metrics rows={rows} filters={filters} />
            <div className="chart-grid">
              <TrendChart
                data={byYear(rows, filters.start, filters.end)}
                subtitle="Annual completions for your current selection"
              />
              <BreakdownChart
                data={groupTotals(rows, "field_family", "field_name")}
                subtitle="Awards summed across your selected years"
              />
            </div>
            <div className="chart-grid lower">
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">INSTITUTION SPOTLIGHT</p>
                    <h2>Largest award totals</h2>
                    <p>Across your selected years and degree levels</p>
                  </div>
                  <a href="#institutions">Explore all →</a>
                </div>
                {ranked.length ? (
                  <ol className="ranking">
                    {ranked.map((i, index) => (
                      <li key={i.key}>
                        <span className="rank-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <a
                          href="#institutions"
                          onClick={() => setSelected(String(i.key))}
                        >
                          {i.name}
                        </a>
                        <strong>{formatNumber(i.completions)}</strong>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <EmptyState />
                )}
              </section>
              <BreakdownChart
                data={groupTotals(rows, "award_level")}
                title="Compare degree levels"
                subtitle="Associate, bachelor's, and master's awards"
              />
            </div>
          </>
        )}
        {page === "fields" && (
          <>
            <Metrics rows={rows} filters={filters} />
            <Fields rows={rows} filters={filters} />
          </>
        )}
        {page === "institutions" && (
          <Institutions
            data={data}
            filters={filters}
            selected={selected}
            setSelected={setSelected}
          />
        )}{" "}
        {page === "about" && <About metadata={data.metadata} />}
        <footer>
          <div>
            <strong>STEM Pathways</strong>
            <p>Public data. Clearer questions. Better conversations.</p>
          </div>
          <div>
            <span>APS Data Technologies × Judson University</span>
            <small>
              Fall 2026 internship · Degrees awarded, not unique students.
            </small>
            <a href="#about">Source & methodology →</a>
          </div>
        </footer>
      </main>
    </>
  );
}

export default function App() {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    loadData(controller.signal)
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, [attempt]);
  if (error)
    return (
      <main className="load-state" role="alert">
        <p className="eyebrow">STEM PATHWAYS</p>
        <h1>We couldn't load the data.</h1>
        <p>{error}</p>
        <button onClick={() => setAttempt((a) => a + 1)}>Try again</button>
      </main>
    );
  if (!data)
    return (
      <main className="load-state" role="status">
        <span className="loading-dot" />
        <h1>Opening Illinois STEM data…</h1>
        <p>Loading the published IPEDS snapshot.</p>
      </main>
    );
  return <Dashboard data={data} />;
}
