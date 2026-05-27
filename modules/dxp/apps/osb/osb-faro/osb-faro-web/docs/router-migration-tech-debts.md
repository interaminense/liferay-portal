# Router migration — tech debts

This document tracks technical debt deliberately deferred from the React Router v5 → v7 migration ([LPD-77522](https://liferay.atlassian.net/browse/LPD-77522)).

The migration's scope is the routing API itself (`createBrowserRouter` + `RouterProvider`). The items below are improvements that the new router enables but that were kept out of scope to keep the bump PR reviewable.

## 1. Adopt `loader` / `action` for route-level data fetching

Today every page fetches its own data via `useQuery` (Apollo), `useRequest`, or `useEffect`. React Router 6.4+ supports `loader` functions that run before the component renders and expose data via `useLoaderData()`. Moving the critical fetches (currentUser, project, channels) into loaders gives parallel data fetching, eliminates render-time flicker, and integrates with `useNavigation()` for global spinners.

Start with the data that `WorkspaceLayout` fetches today (currentUser + project) since the layout already has a natural "block until loaded" semantic.

## 2. Remove the `BundleRouter` compat wrapper

`BundleRouter` was kept as a thin wrapper that calls hooks internally (`useParams`, `useSearchParams`, `useNavigate`) and injects them as props (`params`, `query`, `history`) to preserve the existing component API across ~50 call sites.

Each consumer should be migrated to call the hooks directly, after which `BundleRouter` can be deleted. Migrate page-by-page — there is no need for a single sweeping PR.

## 3. Remove the synthetic `history` adapter from `BundleRouter`

The `history` object that `BundleRouter` injects is synthesized on top of `useNavigate` (with `push`, `replace`, `goBack` shimmed in). When all consumers are hooks-first (item 2), this adapter can be deleted along with the wrapper.

## 4. Migrate `useQueryParams` to `useSearchParams`

`shared/hooks/useQueryParams` returns a plain object built by parsing `useLocation().search`. React Router's `useSearchParams` returns a `URLSearchParams` instance plus a setter — strictly more powerful (programmatic mutation, encoding handled for you) but with a different consumer interface.

Migrate consumers when they need write capability or when refactoring the surrounding page. Until then the custom hook stays.

## 5. Use `route.handle` + `useMatches()` for nav highlighting

`ProfileRoutes` files call `getMatchedRoute(NAV_ITEMS, pathname)` against a hardcoded `NAV_ITEMS` array to highlight the active tab. With React Router's `route.handle` metadata, each route can declare its own `handle: {navKey: '...'}` and the nav bar can read the active key via `useMatches()` instead of doing manual pathname matching.

## 6. Replace `<MemoryRouter>` test setup with `createMemoryRouter`

`test/mock-router.jsx` uses `<MemoryRouter>` and the bulk of route-aware tests mock `useNavigate`/`useParams` directly. For integration tests that exercise multiple routes (navigation, redirects, blockers) `createMemoryRouter` is the canonical setup — it instantiates a full data router and supports `initialEntries`, `loaders`, and `actions`.

Migrate test-by-test as integration coverage grows.

## 7. Derive the `Routes` flat object from the hierarchical config

`shared/util/router.ts` builds a flat `Routes` map (`Routes.CONTACTS_INDIVIDUAL` → `/contacts/:id`) from a nested declarative object via `buildRoutes()`. With `createBrowserRouter`, the canonical config is the hierarchical `RouteObject[]` passed at mount time. Today both representations are kept in sync manually.

Derive the flat `Routes` lookup from the hierarchical config (or from a shared source of truth) so paths are declared exactly once.

---

## Prompt / unsaved-changes inventory (from Stage 1 discovery)

The `<Prompt>` from `react-router` is centralized in `shared/components/NavigationWarning.jsx`. Stage 2 will replace `<Prompt>` internally with the new `useUnsavedChangesPrompt` hook (built on `useBlocker`) — the public API of `NavigationWarning` (the `when` prop) stays the same.

Call sites of `NavigationWarning` (no changes needed at the call-site level):

- `event-analysis/components/BaseEventAnalysisPage.tsx:271`
- `segment/segment-editor/dynamic/index.tsx:271`
- `settings/components/DataTransformation.jsx:398`
- `settings/pages/data-source/UploadCSV.jsx:137`
- `settings/recommendations/components/recommendation-step-card/index.tsx:273`
- `shared/components/workspaces/AddWorkspaceForm.tsx:210`

`getUserConfirmation` is wired up once, in `App.tsx:184`, and feeds the `<Prompt>` chain. It is removed in Stage 2 when the bump to v6 lands.
