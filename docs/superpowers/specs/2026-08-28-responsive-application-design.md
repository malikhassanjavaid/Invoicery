# Invoicery Responsive Application Design

**Date:** 2026-08-28
**Status:** Approved design, pending implementation plan

## Context

Invoicery already uses responsive utility classes, but its mobile behavior is inconsistent. The landing page is mostly fluid, while the dashboard still presents a full sidebar as a stacked header, some data views require horizontal table scrolling, invoice dialogs are dense at narrow widths, and the public invoice document retains desktop spacing on phones.

This work will provide a coherent mobile-first experience across the landing page, authentication screens, dashboard shell, dashboard data views, client and invoice dialogs, profile editor, loading states, and public invoice page without changing application data flows or the visual brand.

## Goals

- Support usable layouts from 320px wide phones through large desktop screens.
- Prevent page-level horizontal overflow at every supported viewport.
- Keep primary actions visible and easy to tap without obscuring content.
- Replace dense desktop tables with readable mobile card presentations.
- Preserve desktop information density and the existing print invoice layout.
- Keep keyboard navigation, focus behavior, and reduced-motion preferences intact.
- Reuse existing theme variables, server data loading, forms, and mutations.

## Non-goals

- No visual rebrand or new design system.
- No database, authentication, routing, or billing workflow changes.
- No separate mobile routes or duplicated mobile application.
- No changes to Vercel, Clerk, Neon, or domain configuration.
- No modification or removal of the existing untracked `output/` directory.

## Responsive Model

The application will remain one codebase with adaptive components. Mobile presentation is the default, with enhancement at existing Tailwind breakpoints:

- **Base, 320-639px:** single-column layout, mobile navigation, stacked actions, card-based data, mobile sheets.
- **Small, 640-767px:** paired form fields and actions where space allows.
- **Medium, 768-1023px:** denser cards, desktop-style tables where they remain comfortable, expanded page spacing.
- **Large, 1024px and above:** persistent dashboard sidebar, multi-column editors, full desktop tables.
- **Extra large, 1280px and above:** existing wide metric and profile layouts.

No component will rely on a fixed viewport width. Fixed maximum widths remain acceptable for readable content, dialogs, and invoice documents when paired with `w-full`, responsive padding, and safe overflow handling.

## Architecture

### Shared navigation behavior

The dashboard navigation model will have two presentations backed by the same item definitions:

- At `lg` and above, retain the persistent left sidebar.
- Below `lg`, render a compact sticky header with the brand, current section, and a 44px hamburger button.
- The hamburger opens a left slide-out drawer containing the same navigation items, the signed-in user controls, and the theme control.
- Opening the drawer locks background scrolling. Escape, backdrop click, route selection, and the close button dismiss it. Focus moves into the drawer on open and returns to the trigger on close.
- The drawer uses `aria-expanded`, `aria-controls`, an accessible label, and visible focus styles.

The landing page will use a smaller mobile menu below `md` for section links and authentication actions while preserving the current desktop navigation.

### Layout primitives

Existing page components will remain responsible for their data and content. Responsive behavior will be implemented through focused presentation components and shared class patterns:

- Dashboard shell controls page gutters, title wrapping, action stacking, and mobile navigation.
- Table-owning pages render a mobile card list below `md` and the existing semantic table at `md` and above.
- Dialog components own their mobile sheet layout and sticky action footer.
- Invoice document owns separate screen-only mobile line-item presentation while retaining its table for larger screens and printing.

This avoids separate mobile pages and prevents responsive behavior from changing server-side data fetching or form actions.

## Screen Behavior

### Landing page

- Keep all decorative background elements clipped inside their sections so they never create page overflow.
- Reduce mobile section padding and large card radii while preserving the current desktop appearance.
- Stack calls to action at full width on narrow phones, with a sensible maximum width at `sm`.
- Convert the desktop navigation links into a mobile menu below `md`.
- Allow invoice mockup rows and summary values to wrap or compress without clipping.
- Maintain fluid headings with lower minimum sizes and balanced line lengths.
- Stack footer columns naturally and keep links at least 44px high on touch screens.

### Authentication screens and loading states

- Use viewport-safe vertical padding and `min-h-dvh` behavior so browser chrome does not crop Clerk cards.
- Use full-width cards with 16px outer gutters on narrow phones.
- Keep the circular loading indicator centered without introducing fixed-size containers.

### Dashboard shell

- Use the approved hamburger drawer below `lg` and the existing sidebar at `lg` and above.
- Change mobile content gutters from desktop spacing to 16px, increasing progressively at `sm` and `lg`.
- Wrap long titles and subtitles safely.
- Stack page actions and make primary buttons full-width at the narrowest breakpoint.
- Preserve the current desktop sidebar width and desktop content alignment.

### Dashboard overview

- Metric cards use one column at the narrowest widths, two columns from `sm`, and four columns from `xl`.
- Currency values use safe wrapping and responsive font sizing so long localized values cannot overflow.
- Recent invoices render as stacked cards below `md`. Each card shows invoice number, client, amount, due date, and status in a clear label/value hierarchy.
- The existing table remains visible from `md` upward.

### Clients

- Client records render as cards below `md`, with identity and email at the top, invoice count beneath, and edit/delete actions in a full-width action row.
- The existing semantic table remains visible from `md` upward.
- Empty and onboarding states reduce padding on phones while preserving centered content.
- Client creation, editing, and confirmation dialogs use the shared mobile-sheet behavior.

### Invoices

- Existing responsive rows are retained but revised so invoice identity, client, amount, status, and actions wrap without overlap.
- Secondary desktop-only metadata remains hidden only where the same information is available in the mobile hierarchy.
- Dropdown menus stay inside the viewport and use touch-sized menu items.
- Preview and delete dialogs use viewport-safe mobile sheets.

### Invoice editor dialog

- Below `sm`, the dialog is a bottom-anchored sheet with a rounded top edge, `max-height: 100dvh`, safe-area padding, an independently scrolling body, and a sticky action footer. From `sm` upward, it returns to the existing centered-dialog presentation.
- The form and live preview stack vertically below `lg`; the preview follows the form.
- Each line item becomes a bordered mobile card: description spans the full row, quantity and unit price share the next row when space allows, and remove is a labeled touch action.
- Date, client, status, tax, and discount fields stack at base and pair at `sm`.
- Cancel and save actions are full-width on narrow phones and return to inline alignment at `sm`.
- The desktop two-column editor and sticky preview remain unchanged at `lg` and above.

### Company profile

- The form remains one column at base and pairs appropriate fields at `sm`.
- Upload/logo controls wrap instead of compressing text or buttons.
- The invoice preview follows the form below `xl` and remains sticky beside it at `xl`.
- Long company names, emails, addresses, and currencies wrap safely in both form and preview.

### Public invoice page

- Reduce outer and document padding on phones while preserving the centered desktop sheet.
- Stack company identity and invoice identity when the header cannot fit side by side.
- Stack billing and date metadata on narrow phones.
- Render line items as compact label/value cards below `sm`; retain the table at `sm` and above.
- Totals use full available width on base and the existing fixed summary width from `sm` upward.
- Page actions wrap and become full-width on narrow phones.
- `print:` styles continue to use the current table-based invoice and remove screen-only controls. Mobile screen adaptations must not alter printed output.

## Dialog and Interaction Rules

- Modal content must remain reachable with the on-screen keyboard open.
- The underlying page must not scroll while a drawer or modal is open.
- Close controls and destructive actions require clear accessible labels.
- Buttons, icon controls, navigation links, and menu items have a minimum 44px touch target on touch layouts.
- Sticky headers and footers may not cover focused inputs; scrolling must reveal the active field.
- Existing server-action error messages remain adjacent to the relevant form and wrap within the viewport.
- Empty, loading, and confirmation states retain their current behavior and only change presentation.

## Accessibility

- Preserve semantic tables for tablet/desktop and printing.
- Mobile card alternatives use headings or definition-style label/value relationships rather than visually ambiguous text.
- Drawer and modal focus are contained while open and restored on close.
- All icon-only buttons receive accessible names.
- Focus rings remain visible in both dashboard themes.
- Motion uses existing transitions and honors `prefers-reduced-motion`.
- Text contrast continues to use existing dashboard and landing theme tokens.

## Verification

Implementation is complete only when the following checks pass:

1. Inspect the landing page, sign-in, sign-up, dashboard overview, clients, invoices, company profile, invoice editor, invoice preview, and public invoice at 320px, 375px, 768px, 1024px, and 1440px widths.
2. Confirm no page-level horizontal scrollbar at any target width.
3. Confirm drawer keyboard behavior, escape dismissal, backdrop dismissal, focus return, and background scroll locking.
4. Confirm modal bodies and sticky actions remain usable with short viewport heights.
5. Confirm public invoice printing retains its desktop table layout and hides screen actions.
6. Run the existing authentication and Clerk-provider regression scripts.
7. Run ESLint and a production Next.js build.
8. Confirm homepage, dashboard, and public invoice routes render without runtime console errors.

## Expected Implementation Areas

The implementation is expected to touch the following focused areas:

- `app/page.tsx` and a small client component for landing mobile navigation.
- `app/dashboard/_components/dashboard-shell.tsx` and a mobile dashboard drawer component.
- Dashboard overview, clients, and invoices presentation markup.
- Client, invoice, preview, delete, and confirmation dialogs.
- Profile form and invoice preview presentation.
- `app/_components/invoice-document.tsx` and public invoice page actions.
- Authentication/loading wrappers where viewport-safe sizing is needed.
- `app/globals.css` only for global overflow, safe-area, or reusable interaction behavior that cannot be expressed clearly with existing utilities.

No database schema, server action contract, route contract, authentication flow, or deployment configuration will change.
