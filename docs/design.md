# Design and interaction record

Design owner: Twinkle Mohan, UX/UI + Data Visualization. Frontend owner: Sri Dhanush Reddy Kondapalli.

The existing Figma file is https://www.figma.com/design/Rxr9Zc3exDhzLhv19xAPYd. Its ten frames document the earlier phone and desktop wireframes. The implemented app preserves the light background, dark green emphasis and chart-led layout. Comparisons, local filters and the location view extend those wireframes; the final Figma alignment and the lead's screen sign-off remain review actions.

A line chart shows annual awards. Horizontal bars compare long field names. The growth table sorts by endpoint change and places unavailable rates last. Comparison tables use the same filters across institutions, while separate trend charts disclose their independent scales. The geographic view uses equal-size dots and an accessible institution list, so marker size cannot imply award volume.

All charts have titles, labeled axes and units, hover details and exact-value table alternatives. Colors distinguish categories but labels carry the meaning. Controls have visible focus styles and semantic labels. The phone layout wraps navigation and filters without horizontal page overflow. Long comparison tables scroll within their container.

The advising flow is: choose a question, narrow the data, read exact values, compare institutions and save a CSV or selection link. The built-in guide explains each step. No student names, sign-in, admissions score, costs, salary or predicted outcomes are collected or implied.

Observed corrections: the institution count now follows the selected college; field growth sorts by the requested measure; saved URLs validate unknown values; geographic filters use annual directory attributes; ranking labels use the latest name in the selected records; empty comparisons disable export. See qa/bugs.csv and qa/results.md.

Remaining usability review: a counselor should try a real advising question, explain the units back to the team and confirm the controls are understandable. This has not been represented as completed user research.
