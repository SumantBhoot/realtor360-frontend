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

Schedule accents match the SVG's 2 px inset shadows: visits `#0eeabe`, follow-ups `#e192ad`, and offers `#ffe100`. The closed-deals progress endpoint uses the SVG's straight dash segments and two endpoint dots rather than a dashed border around the rounded fill.

Desktop and mobile screenshots: [desktop](desktop-preview.jpg), [mobile Home](mobile-preview.jpg), [mobile Contacts](contacts-mobile-preview.jpg).

Desktop previews show Home at 1440 × 1182 and Contacts at 1440 × 1144. Mobile previews were refreshed on October 10, 2026, after the mobile layout fixes described below. Fonts and images finished loading before capture.

## Functional browser checks

- Searching **Serenity** returns only Serenity Villa and no matching contacts.
- Opening Serenity Villa shows the expected price, status, unit count, active-lead count, and views.
- Sorting by Views produces Maplewood House, Rosehill Cottage, Skyline Edge, Serenity Villa in ascending order.
- Selecting Angel Plaza in a chart legend updates both legends and leaves only the Angel Plaza pipeline row with 3 records; clearing restores all rows.
- Advancing the calendar shows August 2025 with an empty schedule; returning to July and selecting July 10 shows the two client visits. Show all restores the full schedule.
- Calendar header regression: February previously clipped the next-month arrow at 1440 px. Longer month titles now wrap while both 28 px arrow buttons keep their space. Checked all 12 months at 320, 390, 768, 1150, 1151, 1280, 1350, 1366, 1440, and 1920 px; both arrows stay inside the card and viewport, and titles do not overlap the calendar grid.
- Marking a reminder complete survives a page reload. Reset completed reminders restores the initial state.
- Jessica Chen's contact dialog shows the supplied email and location.
- Mobile navigation exposes all primary destinations and closes when a destination is chosen.
- At 320 px, 390 px, and 768 px viewport widths, the document has no horizontal overflow. The listings table scrolls independently inside its card.

## Contacts screen

Reference: node `28:430`, 1440 × 1144, measured using view-only PNG/SVG exports.

The browser matches the 296 px sidebar, toolbar at y=65 with height 111, table header at (334,197) with dimensions 1081 × 49, first row height 95, and seven subsequent rows of height 91. Row boundaries are y=341,432,523,614,705,796,887,978. Filter buttons start at (22,966), width 252. Pagination sits at y=1083. All images and local fonts loaded, with no console warnings or errors.

Status badge outlines retain the source's 1 px border and add a matching 0.5 px inset stroke for the requested stronger appearance. Checked all five statuses at 1440 px; original colors and 25 px badge heights are preserved, with no width or height changes.

- Searching Ananya returns two records; Active returns four; Active plus Buyer returns one (Ananya Verma). Reset restores all eight.
- Global search for Ravi returns two records. Sorting Contact Name orders Ananya, Emily, John, Ravi.
- Table/card switching, contact detail dialogs, pagination empty states, and return to page 1 work.
- The creation form rejects an empty required name. A QA contact created on an isolated localhost origin persisted after reload and matched combined Pune/Referral filters. No backend service is used.
- Home/Contacts navigation and reloading the Contacts route work.
- At 320, 390, and 768 px viewport widths, the document has no horizontal overflow. The table scrolls independently. Mobile filters open, apply Buyer (three matches), reset, and dismiss with Escape.

Screenshot: [Contacts desktop](contacts-preview.jpg).

## Mobile refinements — October 10, 2026

- The mobile header now reserves explicit grid positions for the logo, profile, menu, and full-width search. Metric cards have equal heights at narrow widths, with trend badges on a consistent second line.
- Lead source annotations use a readable two-column legend. The mobile donut preserves the original four SVG segments and omits desktop annotation arrows. Stage labels use horizontal bars on phones; chart legends wrap and have larger touch targets.
- Phone property cards expose type, units, price, status, lead count, and views. Name, Units, and Views controls retain the table's sorting behavior. Contacts automatically uses cards at widths up to 700 px and switches back to its table above that breakpoint unless the user explicitly chooses a view.
- Contact search and toolbar controls occupy separate rows. The mobile filter panel locks background scrolling, keeps its close/apply/reset buttons visible, scrolls the fields independently, traps keyboard focus, and restores focus when dismissed. Inputs and selects use 16 px text on phones, and dialogs wrap long content within the viewport.
- Home was checked at 320, 375, 390, 430, 700, 701, 768, 900, 1024, and 1440 px. Contacts was checked at 320, 390, 700, 701, 768, 1024, and 1440 px. Neither route has document overflow. Phone cards and chart contents fit their panels; desktop/tablet tables retain contained horizontal scrolling.
- All 13 Home cards retain the desktop rectangles recorded above at 1440 × 1182. Contacts still uses the desktop table and sidebar at 1440 × 1144.
- At 320 px, Views sorting returned Maplewood House, Rosehill Cottage, Skyline Edge, and Serenity Villa. Selecting Angel Plaza updated the stage bars and left one pipeline row. The Serenity Villa dialog stayed within the viewport with no internal horizontal overflow. All twelve month titles from July 2025 through June 2026 fit without overlapping the calendar arrows, and mobile navigation exposed all 11 destinations.
- Applying Buyer filters returned the expected three contact cards and restored body scrolling and focus to the filter toggle.
- At 320 px, normal keyboard interactions confirmed that the filter panel locks body scrolling, Shift+Tab/Tab wrap between its first and last controls, and Escape closes the panel and restores focus. The optional table and display dropdown stay inside the viewport. The ten-field creation form fits the dialog without horizontal overflow.
- The favicon reuses the bundled listing icon, resolving the browser's missing favicon request.
- TypeScript validation, the production build, and verification of all 37 SVG assets passed.

Updated screenshots (CSS viewport dimensions, device pixel ratio 1):

| View                   | Viewport  | Screenshot                                              |
| ---------------------- | --------- | ------------------------------------------------------- |
| Home                   | 390 × 844 | [Full mobile Home](mobile-preview.jpg)                  |
| Home, narrow phone     | 320 × 740 | [Full narrow Home](mobile-320-preview.jpg)              |
| Contacts               | 390 × 844 | [Full mobile Contacts](contacts-mobile-preview.jpg)     |
| Contacts, narrow phone | 320 × 740 | [Full narrow Contacts](contacts-mobile-320-preview.jpg) |
| Contact filters        | 390 × 844 | [Filter panel](contacts-mobile-filters-preview.jpg)     |

## Fidelity limits

This is a close visual reproduction, not a claim of zero pixel difference. Browser font rasterization, font version metrics, and a few text/chart positions may differ from Figma. Mobile and tablet layouts are adaptations rather than supplied design variants. Filtered chart series are demo values inferred from the static artwork; they are not a backend dataset.
