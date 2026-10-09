# Verification

## Reference

Figma file `w3ZJn4OeQVLudyC0jOzOYW`, node `2:6286`, Home Screen, 1440 × 1182.

The Figma connector could not read the file because it requires edit access. The implementation was instead measured against the owner's permitted view-only PNG and SVG exports in Chrome. The SVG exposed font families, sizes, weights, colors, vector shapes, embedded source imagery, and frame coordinates.

## Visual checks

At a 1440 × 1182 browser viewport, measured DOM rectangles match the exported frame for all 13 cards:

| Card                  |    x |   y | Width | Height |
| --------------------- | ---: | --: | ----: | -----: |
| Active Listing metric |   26 |  85 |   260 |    100 |
| Active Leads metric   |  301 |  85 |   260 |    100 |
| Total Closed metric   |  576 |  85 |   260 |    100 |
| Total Revenue metric  |  851 |  85 |   260 |    100 |
| Lead source           |   26 | 195 |   535 |    334 |
| Stages                |  576 | 195 |   535 |    334 |
| Sales people          |   26 | 539 |   535 |    196 |
| Total deals closed    |   26 | 745 |   535 |    128 |
| Pipeline              |  576 | 539 |   535 |    334 |
| Active listings table |   26 | 883 |   810 |    279 |
| Lead contacts         |  853 | 883 |   258 |    279 |
| Reminder              | 1126 |  85 |   289 |    370 |
| Calendar and schedule | 1126 | 465 |   289 |    697 |

Original source assets are stored locally, with original geometry and dependent SVG definitions preserved. All visible images loaded successfully. Font loading was confirmed before the final screenshots. No browser console warnings or errors were recorded during interaction checks.

Desktop and mobile screenshots: [desktop](desktop-preview.jpg), [mobile](mobile-preview.jpg).

## Functional browser checks

- Searching **Serenity** returns only Serenity Villa and no matching contacts.
- Opening Serenity Villa shows the expected price, status, unit count, active-lead count, and views.
- Sorting by Views produces Maplewood House, Rosehill Cottage, Skyline Edge, Serenity Villa in ascending order.
- Selecting Angel Plaza in a chart legend updates both legends and leaves only the Angel Plaza pipeline row with 3 records; clearing restores all rows.
- Advancing the calendar shows August 2025 with an empty schedule; returning to July and selecting July 10 shows the two client visits. Show all restores the full schedule.
- Marking a reminder complete survives a page reload. Reset completed reminders restores the initial state.
- Jessica Chen's contact dialog shows the supplied email and location.
- Mobile navigation exposes all primary destinations and closes when a destination is chosen.
- At 320 px, 390 px, and 768 px viewport widths, the document has no horizontal overflow. The listings table scrolls independently inside its card.

## Limits

This is a close visual reproduction, not a claim of zero pixel difference. Browser font rasterization, font version metrics, and a few text/chart positions may differ from Figma. Mobile and tablet layouts are adaptations rather than supplied design variants. Filtered chart series are demo values inferred from the static artwork; they are not a backend dataset.
