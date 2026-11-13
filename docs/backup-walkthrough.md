# Captioned backup walkthrough

This 2 minute 30 second video is compiled from actual dashboard screenshots and editable presentation slides. It has captions and no audio. It is a demonstration aid, not evidence of a completed team rehearsal or live presentation. The full team demo follows docs/demo-script.md.

## 0:00 — Purpose
Explore Illinois STEM degrees with counselors and advisors. This captioned backup uses captured application screens and presentation slides; it is not a recording of the team rehearsal.

## 0:15 — Overview
Start with all filters. The snapshot contains 187,386 degrees awarded from 2016 to 2023. Read the annual trend, field totals and degree-level totals. Counts are awards, not unique students.

## 0:30 — STEM fields
Use STEM fields to compare the six families. Sort the table by endpoint growth. Computer and information sciences rose from 7,107 to 9,841 awards, or 38.5 percent. Read the classification caveat.

## 0:45 — Institutions
Search for a college and open its trend and field mix. Shared filters still apply. Judson University has 66 selected STEM awards across the full snapshot. Missing records are not treated as zeros.

## 1:00 — Compare
Choose the latest computer science bachelors preset, then Chicago and Public. Compare Chicago State and University of Illinois Chicago: 9 and 454 awards. Download matching CSV exports these selected colleges only.

## 1:15 — Map
Find institutions by their directory coordinates. Filter by city or institution control. Search the accompanying list when markers overlap. The list search does not change the map or export scope.

## 1:30 — About the data
Read first-major counting, six-digit CIP detail and the three degree levels. City and control use the award-year directory. Map locations use the latest snapshot record. Confirm current programs with each college.

## 1:45 — Reproduce the data
Open notebooks/clean_ipeds.ipynb. Run the cells in order. The build joins 16 annual sources and reproduces all six exports. Independent checks match all 3,808 aggregate cells. Teammate Colab review is still required.

## 2:00 — Local advising case
The Chicago public computer science bachelors selection has 566 awards across three institutions in 2023. Save the selection URL or print an advising brief. These figures do not rank program quality or predict employment.

## 2:15 — Handover
The application is live on Vercel. The source is published on feature/stem-dashboard for review. Another teammate must approve before merge and v1.0 tagging. Confirm scope, ownership and automatic deployment, then hold the actual demo and collect feedback.
