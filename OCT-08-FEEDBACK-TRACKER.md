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

## Full transcript reconciliation (Plaud: bfp first workthrough, 92m 38s)
Reviewed the complete 103-segment transcript alongside Rebekah's 10/8/26 planning document. These requirements are not all implemented; use as the development acceptance checklist.

### Design and governance
- Preserve the original demo's visual language and navigation, especially the location selector; add current BFP and Davis branding when final assets are supplied.
- Monthly operational reporting is the primary purpose. Replace or repurpose Daily Work as an internal tasks, notes, assignments and notification center.
- Lock completed month and year reporting periods; production requires privileged unlock with audit trail.
- Warehouse-only restricted entry for incoming/outgoing food, separate from leadership/admin roles.
- Export all records; import historical aggregate spreadsheet/CSV records dating back to approximately 2020 without sensitive client details.
- Real access controls and authentication must wait for BFP-owned Supabase/Vercel production stack; a browser-only PIN is not security.

### Incoming/outgoing food and rescue
- Intake: donor selection/new donor; recurring donor totals and donation counts; anonymous Door category; date, weight, source, category and optional food drive name.
- Monthly donor thank-you letters for named donors with postal details, printable as a batch.
- Outgoing: destination pantry/partner, pounds, seven grocery categories via checkbox; printable/email-ready official food-bank transfer form after BFP provides exact form.
- Touch-friendly entry, reusable tare weights (Gaylords), automatic net calculations, truck outbound/return weights.
- Grocery Rescue separately reportable; MealConnect API/export feasibility unverified. Do not store shared credentials in public repo or browser demo.
- Incoming/outgoing, Grocery Rescue and Monthly Inventory must remain separate tabs, with connected data.
- Monthly inventory requires opening balance, receipts, outgoing categories, returns, disposal and count/adjustment records. Printable inventory count sheet and auditor-friendly history.
- Potential measures: pounds to clients, partners, farmers, disposed, food drives, organizations served; decide which appear on public vs board reports.

### Client services and offsite
- Client Services roll-up across Market, Mobile Truck, Mobile Bus and Mini Market, using aggregate imports rather than a new sensitive client database.
- Market: duplicated/unduplicated households and individuals, new clients, percentage outside Davis County, average households per market shift, pounds per duplicated household and individual.
- Mobile and Mini Market grouped under Off-site Services, retaining bus vs truck and location breakdown; allow inactive programs to be hidden from current board report while preserving history.
- Tryn's mobile Google Sheet workflow should move into the system after sample sheet arrives.
- Truck pounds distributed = outbound load less returned load and separately categorized transfers/disposal, according to agreed reconciliation. Do not infer pounds for bus.

### Annual school programs
- Pantry Packs / DSD annual rather than daily or monthly metrics: packs through DSD, packs in Davis County including charter schools, principal pantry totes distributed in DSD, DSD schools served.
- Optional major project calendar only if needed.

### Engagement and volunteers
- Community Engagement monthly indicators: social views, volunteer hours, website visits, Google profile views/calls/directions/searches, Pantry Family Night groups, sorting groups, donor and volunteer newsletter sends/opens/clicks, attributed donations.
- Volunteer kiosk: easy four-digit code check-in/out, large touch targets, annual hours and milestones, birthday-month messaging, closure/event notices, inactive status, photos and consent, role-specific email lists.
- Staff-only volunteer directory; no public volunteer roster or exposed PINs.
- Volunteer mock-up and full role/consent rules still needed.

### Leadership
- Monthly manual, explicitly unaudited financial inputs: general donations, gross revenue, expenses, budget, YTD gross revenue, YTD expenses and YTD net revenue.
- Report each location separately or combined; geography aggregated at fiscal/calendar year end.
- Remove redundant Operational Reports navigation if it merely duplicates other modules.
- Board report should pull selected period and location metrics, allow optional sections and commentary, export print-ready PDF, and include financials when approved.
- Grant tracker: grantor, applied date, requested amount, awarded amount, restrictions, spend deadline, reporting due, status and follow-up history; await Rebekah's exact field requirements.
- Barrels/Gaylords public request intake: request dates, pickup/dropoff, approval and notifications; website integration decision pending.

### Production/handoff
- Demo remains entirely synthetic, GitHub Pages hosted. No real personal records or shared credentials.
- BFP to own independent GitHub, Vercel and Supabase, with F&H access removed after migration, testing, documentation and training.
- Deliver a user guide with screenshots, quick reference, admin guide and handoff checklist.

## October 10 consolidated demo push
- Daily Work now includes browser-local staff follow-up tasks with owner, due date, open/done status and CSV export. No secure staff assignments or notifications.
- Daily Work includes a fictional Barrels/Gaylords internal request log with pending/approved/completed states and CSV export. Public intake and email notifications are **not** connected.
- Inventory count printing uses the dedicated count-sheet function rather than an older duplicate handler.
- These are demonstration workflows only; browser visual testing, staff validation, and production authorization remain outstanding.

## Role-based sign-in requirement — confirmed October 10
At minimum, the future BFP system requires three authenticated roles: **Executive Director**, **Staff**, and **Volunteer**. Executive Director can access organization-wide reporting, financials, grants, and user administration. Staff can use assigned operational workspaces; permissions must support narrower warehouse-only staff access and prevent unnecessary access to financial and client information. Volunteers must see only their own profile, opportunities, schedules, announcements and hour records; the 4-digit kiosk attendance code is not an account login. Production authorization must be enforced in BFP-owned backend policies (including Supabase RLS), not only by hiding navigation in the browser. This public GitHub Pages demo must not imply that role selection, localStorage, or a PIN provides security. Exact staff permission matrix, account recovery, volunteer guardian/minor handling and administrator onboarding remain to be confirmed with Rebekah.
