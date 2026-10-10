# Bountiful Food Pantry — October 8 feedback implementation tracker

Development location: Foundations-and-Horizons/BFP-Demo (GitHub Pages). Synthetic demo data only. Production will move to BFP-owned GitHub, Vercel and Supabase accounts. F&H access is removed at handoff.

## Implemented in current demo
- Rename Food & Grocery Rescue navigation to Incoming / Outgoing Food.
- Add a separate Grocery Rescue reporting workspace based on existing source-tagged incoming food records.
- Add a separate Inventory workspace, with a clear warning that current records cannot produce an auditable closing inventory balance.
- Rename Mobile navigation to Off-site Services, retaining existing mobile data and screens.

## Next build work (after source trackers and rules are supplied)
- Incoming and outgoing daily warehouse ledger; distinguish receipts, distribution to clients, partners, farmers, disposal, returns, and food drives.
- Warehouse-only permissions, with no access to other organizational data.
- Month-end locking, adjustments, audit history, and printable inventory sheets.
- Location-specific off-site and Mini Market tracking, configurable visibility in board reports; mobile truck pounds only when returns can be reconciled.
- Market metrics: duplicated/unduplicated households and individuals, new clients, Davis County percentage, average households per shift, average pounds per duplicated household/individual.
- Volunteer self-service PIN clock-in/out, annual hours, birthday messages, notices, inactive status, photos, targeted emails; PIN is an attendance convenience, not admin authentication.
- Board report with date filters, location breakdowns, financial summary (marked unaudited), community engagement, optional sections, and PDF export.
- Grant tracker with applications, grantor, restrictions, awards and reporting due dates.
- Spreadsheet imports (historical records potentially back to 2020), exports, deduplication, and review.
- BFP user guide, quick reference sheets, administration and ownership handoff checklist.

## Explicit decisions and open questions
- Do not integrate PantrySoft; Rebekah prefers summary reporting without individual client records.
- MealConnect compatibility is unverified; do not claim integration.
- Grocery Rescue daily entry vs monthly report import awaits Rachelle's workflow and MealConnect constraints.
- Inventory and pounds distributed cannot be derived accurately from existing demo receipts/visits alone.
- Rebekah does not want daily Pantry Pack tracking; year-end school totals are the priority.
- Geographic analysis should use aggregated totals, not require client/donor PII.
- Pending: Rachelle's warehouse/inventory tracker, Tryn's off-site tracker and volunteer mock-up, grant requirements, board report examples, branding for Davis.
