# Design handover — B-09 and B-10

[Editable Figma wireframes](https://www.figma.com/design/Rxr9Zc3exDhzLhv19xAPYd) contain five views at 375 px and 1280 px: Overview, Fields, Institutions, Filter states, About. Ten frames. These are wireframes for review, not approved final designs. Share their link in the team's Slack channel; posting has not been performed here.

## Chart choices
| Question | Chart / presentation | Axes / units |
|---|---|---|
| Annual direction | Line chart; do not bridge missing values | Award year / degrees awarded |
| Fields and growth | Horizontal bar + endpoint comparison table | Degrees awarded / STEM field; table % and annualized % |
| Degree levels | Horizontal bar | Degrees awarded / award level |
| Largest institutions | Ranked top-eight list | Institution name / selected-period award total |
| Institution profile | Line plus field bar | Same units as regional views, one UNITID only |

Figma's overview bars are schematic placeholders; production annual trends use a line. The implementation includes chart titles, tooltips, labeled axes, non-color cues and exact-value tables. Tables are the fallback for readers who cannot distinguish the colors. Formal accessibility and physical-device review remain Validation work.

The UI uses sage backgrounds, deep green navigation and emphasis, restrained teal/orange chart colors, visible focus, generous spacing, and responsive chart stacking. Mobile keeps controls labeled rather than hiding their meaning. The data snapshot and counting unit remain visible.

UX/UI + Data Visualization should review designs, implement any agreed refinements in `src/components/Charts.jsx` / `src/styles.css`, and document actual review findings in their role report. Do not upload another copy of the whole React app.
