# Twinkle Mohan

Role: UX UI and Data Visualization

Stage: Validation and Handover. AI-assisted implementation prepared on the lead’s behalf; ownership is not a claim of individual authorship.

## Role and current position

Twinkle owns the dashboard’s visual design and data presentation. The role is to make the questions easy to follow, choose suitable charts and keep the values understandable on both a laptop and a phone. The implemented design is ready for her review against the existing Figma wireframes.

## What the implementation provides

Annual awards appear in line charts. Horizontal bars compare STEM families and degree levels without forcing long names into narrow labels. The field table shows both endpoint values, percent change and compound annual growth, and it can sort by growth, total awards or name. Missing or zero baselines remain unavailable rather than producing a misleading rate.

The comparison view puts up to three institutions under the same filters and shows their exact totals together. Its separate trend charts clearly state that they use independent vertical scales. The geographic view plots equal-size dots from the IPEDS directory and keeps every institution accessible in a searchable list. A short findings section explains the current selection in plain language.

## How it works

src/components/Charts.jsx contains the line and horizontal bar charts, tooltips and accessible value tables. src/components/Advising.jsx contains the comparison, geographic view and findings. src/data.js calculates the totals and growth before formatting. Labels, table values and axis units carry the meaning; color is not the only way to distinguish categories.

The layout uses a light background, dark green emphasis and readable spacing. Navigation and filters wrap on small screens. Source and classification notes stay close to the results so users can see the limits before drawing a conclusion.

## Evidence to discuss

The field-growth view places computer and information sciences first for the complete 2016–2023 selection, with 7,107 and 9,841 endpoint awards and 38.5% growth. All source cells reconcile independently. The desktop layout and a 375-pixel frame have been inspected. Map markers can overlap around dense locations, so the list is intentionally retained as the complete access route.

## Review and next actions

Twinkle should review every chart title, axis, tooltip, table and small-screen layout herself. The existing Figma file records the earlier wireframes; the final comparison, map and additional filter designs still need an explicit design review. She should make any genuine corrections under her own GitHub account, then record the review or PR link in this report.

A counselor usability session remains open. The team should ask a counselor to answer a real question and explain what the displayed unit means. This report does not claim that such a session has already happened.

## Files to present

src/components/Charts.jsx; src/components/Advising.jsx; src/styles.css; src/data.js; docs/design.md; docs/qa/stem-fields.jpg; docs/qa/stem-map.jpg.
