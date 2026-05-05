# Analytics Cloud Charts

Liferay client-extension widget that embeds Analytics Cloud (AC) metrics into any DXP page. Each instance persists its own configuration (metric, time range, colors, AI toggle) so the same page can host multiple widgets, each showing a different chart.

## Feature summary

- **11 metrics** organized by scope:
  - **Page-level** (4): Devices, Page Engagement, Page Overview, Page Path
  - **Site-level** (7): Acquisitions, Audience Size, Search Terms, Site Overview, Top Pages, Traffic Heatmap, Visit Frequency
- Per-instance configuration via `SettingsModal` (cog icon, admin-only): metric picker (mini-cards with scope badges), time range, chart color picker (8 native `<input type="color">`), and Auto-narrative insights toggle
- **Auto-narrative insights** (opt-in): renders an AI-generated 1-2 sentence summary below the chart explaining the most notable observation. Currently calls Anthropic API directly using a developer-supplied key (TEMPORARY — see `src/lib/anthropic-dev.ts`); will switch to **Liferay AI Hub** once the `ai-hub-liferay` GCP project is provisioned
- **Module-level caching** with `fetchPolicy: 'cache-first'` for non-volatile time ranges (anything except `rangeKey === 0` / "Today"), saving network round-trips when admins switch metrics back and forth
- Info popover next to the card title explaining the selected metric
- Sign-in required gate for non-authenticated visitors

## Tech stack

- **React 18.3** as a custom element (`<analytics-cloud-charts>`) mounted via `createRoot`
- **TypeScript 5.7**, **Vite 5** (CSS inlined via `?inline` to keep the bundle single-file)
- **Recharts 2** (line/area/bar/pie/sankey) plus custom CSS-grid charts (Traffic Heatmap, Top Pages list, Search Terms bar)
- **@clayui v3**: `button`, `empty-state`, `modal`, `popover`, `tabs` (popover loaded at workspace level via yarn hoisting)
- **classnames** for class composition
- **Liferay Object** (`AnalyticsCloudChartsPreferences`) for per-instance persistence — keyed by portlet `instanceId` extracted from the DOM via `closest('[id^="p_p_id_"]')`
- **Analytics Cloud GraphQL** at `/o/analytics-rest/v1.0/graphql` (cookie auth + CSRF token via `window.Liferay.authToken`)
- **Anthropic API** (TEMPORARY) at `https://api.anthropic.com/v1/messages` with `anthropic-dangerous-direct-browser-access`; key stored in browser `localStorage` only

## Architecture

```
<analytics-cloud-charts>            ← custom element (Light DOM)
  └─ <App>
      ├─ ChartPaletteProvider       ← supplies palette to all charts via context
      ├─ Card.Header
      │   ├─ Card.Title             ← shows METRIC_LABEL[metric]
      │   ├─ ScopeBadge             ← "PAGE" / "SITE" / "ASSET"
      │   ├─ Info popover           ← description from METRIC_INFO[metric]
      │   ├─ DropdownRangeKey       ← time range selector (read-only for non-admins)
      │   └─ Settings cog button    ← admin-only → SettingsModal
      └─ Card.Body
          └─ <metric>Card             ← 1 of 11; wraps useQuery + StatesRenderer
              ├─ <metric>CardContent  ← chart + KPI/empty state
              └─ AIInsightCallout    ← rendered when aiInsightsEnabled
```

**State**:
- `usePreferences(instanceId)` — per-instance Liferay Object (channelId, metric, rangeKey, chartColors, aiInsightsEnabled)
- `useChannelId()` — discovers AC channelId for the current site/scope
- `useQuery<T>(query, vars, {fetchPolicy})` — GraphQL fetch with module-level Map cache
- `useAIInsight(enabled, prompt)` — Anthropic call (or AI Hub once switched) with separate insight cache

**Single source of truth**: `src/lib/metric-info.ts` exports `METRIC_INFO` (`Record<Metric, {label, description, scope}>`) used by both the SettingsModal mini-cards and the header info popover. Adding a new metric only requires touching this map plus the `Metric` enum in `usePreferences.ts`.

## How to use

### As an admin (end-user)

1. Log in as admin (`test@liferay.com` / `123` for local at `localhost:7400`)
2. Drag the **Analytics Cloud Charts** widget from the page editor onto a Liferay page
3. Click the cog → pick a metric (mini-cards with description + scope badge) → choose a time range → optionally tweak chart colors → Save
4. (Optional) Enable **Auto-narrative insights**, paste an Anthropic API key (`sk-ant-...`)
5. Reload — preferences persist via Liferay Object

### As a developer

```bash
# Install (legacy-peer-deps required for clayui v3 + react 18 alignment)
cd workspaces/analytics-cloud-charts-workspace/client-extensions/analytics-cloud-charts
npm install --legacy-peer-deps

# Type-check
npm run typecheck   # 3 pre-existing TS errors in OperatingSystem/Sankey/WebBrowser
                    # (Recharts TooltipProps generic mismatch — non-blocking; vite build ignores)

# Build (Vite, single bundle ~700 kB)
npm run build

# Deploy to local Liferay bundle (requires liferay.workspace.home.dir in gradle.properties)
cd ../..   # workspace root
./gradlew :client-extensions:analytics-cloud-charts:deploy
```

### Repo layout (key files)

```
src/
├── App.tsx                              ← root + render switch
├── main.tsx                             ← custom element registration + CSS injection
├── styles/card.css                      ← border/radius matching Faro Card
├── components/
│   ├── Card.tsx                         ← Bootstrap card wrapper
│   ├── SettingsModal.tsx                ← metric picker + time range + colors + AI toggle
│   ├── ScopeBadge.tsx                   ← Page/Site/Asset chip (shared)
│   ├── AIInsightCallout.tsx             ← below-chart AI summary
│   ├── ErrorDisplay.tsx
│   ├── states-renderer/                 ← loading/error/success/empty switch
│   ├── dropdown-range-key/              ← time range picker
│   ├── charts/                          ← Recharts + custom-CSS chart components
│   └── *-card/                          ← 1 folder per metric: Card.tsx + CardContent.tsx
├── hooks/
│   ├── usePreferences.ts                ← Liferay Object CRUD + permissions auto-grant
│   ├── useQuery.ts                      ← GraphQL fetch + cache + fetchPolicy
│   ├── useChannelId.ts                  ← AC channel discovery
│   └── useAIInsight.ts                  ← AI call (TEMPORARY: Anthropic; future: AI Hub)
└── lib/
    ├── analytics.ts                     ← GraphQL queries + DTOs + restFetch/graphqlFetch
    ├── chart-palette.tsx                ← Context + useChartPalette hook
    ├── charts.ts                        ← CHART_PALETTE + format/color helpers + hexToRgb
    ├── fetch-policy.ts                  ← fetchPolicyForRange(rangeSelectors)
    ├── liferay.ts                       ← extractPortletId + EMPTY_STATE_IMG_SRC
    ├── metric-info.ts                   ← METRIC_INFO + METRIC_OPTIONS (single source of truth)
    ├── format.ts                        ← formatDate, formatKey
    ├── anthropic-dev.ts                 ← TEMPORARY: dev-only Anthropic fallback
    └── ai-hub.ts                        ← AI Hub constants (kept for the eventual revert)
```

### Sibling workspace pieces

- (No sibling CEs — the widget self-bootstraps via the in-app `SetupRequiredEmptyState` wizard, which guides admins to create the `AnalyticsCloudChartsPreferences` custom object manually via Control Panel.)

## Roadmap / suggested improvements

### 1. Compare to previous period

Standard pattern in Google Analytics, Mixpanel, Looker. Toggle in `SettingsModal` (next to time range) → every chart overlays a dashed series of the previous equivalent window (last-7-days vs previous-7-days, etc.).

**Implementation sketch**:
- Several AC Metrics already return `previousValue` / `previousValueKey` per histogram bucket — use directly when present (Page Engagement, Site Overview already query these but ignore them in the UI today)
- For queries without built-in previous data (Acquisitions, Search Terms): fire a second fetch with a shifted `rangeStart`/`rangeEnd` and merge client-side
- Update each chart component to accept an optional `previous` series:
  - `<AreaChart>` / `<LineChart>`: render a second `<Area strokeDasharray="4 2" stroke={fadedColor}>`
  - `<BarChart>` (Visit Frequency): grouped bars (current vs previous side-by-side)
  - `<KpiCard>`: already shows trend %; just enrich the sparkline with the previous overlay
  - Donut (Acquisitions): show two concentric rings — outer current, inner previous
- New preference: `comparePrevious?: boolean` in `Preferences`
- Cache key in `useQuery` already varies by `JSON.stringify(variables)`, so the previous-period fetch gets its own cache slot automatically

**Effort**: ~1 day (most charts already support 2 series; the work is in the toggle + variable shifting + UI tweaks).

### 2. Download Report

Export the current card as **PDF**, **PNG**, or **CSV** via a dropdown in the card header (right of the cog).

**PNG**: capture the chart container with `html-to-image` (~5 KB lib) or Recharts' built-in SVG export. Trigger via `<a download>` blob URL.

**CSV**: serialize the underlying data array — already in scope inside each `Card` after `useQuery` resolves. Format depends on metric:
- Histograms (Page Engagement, Audience Size) → `valueKey,value` rows
- Compositions (Acquisitions, Search Terms) → `name,count`
- Heatmap → `day,hour,value`
- Top Pages → `title,url,views,entrances,exitRate`

**PDF**: branded multi-section layout with `jsPDF` + `html2canvas`:
- Header: site name + date generated + selected time range
- Card image (PNG of the chart)
- Data table
- AI insight text (if `aiInsightsEnabled`)
- Liferay logo footer

**Reuse opportunity**: Faro Web (`modules/dxp/apps/osb/osb-faro/osb-faro-web/src/main/js/shared/components/download-report/DownloadPDFReport.tsx`) already has working PDF generation — port the styling/sections, adapt to single-card scope.

**Effort**: ~1.5 days (PNG + CSV are quick; PDF is the bulk).

### 3. Other candidates (lower priority)

- **Cohort Retention** matrix (`cohort` query) — distinct visualization not yet in the widget
- **Top Locations** — geographic ranked bar via `Metric.geolocation` field on existing queries
- **Top Interests** — quick win, reuses `SearchTermsBar` component with `siteInterests` query
- **Annotations on charts** — admin pins a date with a note ("Launched campaign X"); persists in `Preferences` as `annotations: [{date, text}]`
- **Multi-metric dashboard mode** — render N metrics in a grid inside one widget instance (config: `metrics: Metric[]` instead of single `metric`)

## Testing checklist (manual)

After any change, verify in `localhost:7400` as `test@liferay.com`:

1. Drop widget on a page, no preferences → empty state with "Click settings to choose a metric"
2. Pick each of the 11 metrics → renders without console errors
3. Switch rangeKey → only `rangeKey === 0` re-fetches; others come from cache (Network tab)
4. Toggle Auto-narrative insights + paste Anthropic key → callout appears with AI text
5. Toggle off → callout disappears immediately
6. Reload → preferences persist
7. Open as Guest (incognito) → "Sign in required" empty state, no GraphQL calls
8. Two widget instances on the same page with different metrics → independent state

## Known limitations

- **Typecheck noise**: 3 pre-existing TS errors in `OperatingSystem.tsx`, `Sankey.tsx`, `WebBrowser.tsx` (Recharts `TooltipProps` generic mismatch). Vite build ignores; deploy works. Fix would be a contained PR widening the generic.
- **Chart palette + Style Book**: chart colors come from `CHART_PALETTE` (Faro `CHART_COLORS`) overridable via the per-instance picker. Not yet integrated with Liferay's Style Book / Frontend Tokens.
- **AI insights cost**: each cache miss = 1 Anthropic call. Long sessions with many rangeKey switches can accumulate. Mitigated by module-level cache + opt-in toggle + 200-token max output.
- **AI Hub migration pending**: `src/lib/anthropic-dev.ts` is the temporary path. Search for `TEMPORARY` to find the 4 spots to revert when AI Hub is provisioned.
- **`individualMetric` performance**: the AC backend struggles with this query when histogram + multiple aggregations are requested together. Audience Size was reduced to a single `value` call (plus optional Known breakdown computed client-side as `total - known`).
