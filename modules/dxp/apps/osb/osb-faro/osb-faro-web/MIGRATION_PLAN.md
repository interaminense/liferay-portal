# osb-faro-web Migration Plan

## [x] LPD-77745, LPD-77746, LPD-77747, LPD-81379 — Phase 1 — Build Tooling Upgrade

Upgrade React 16 → 18, TypeScript → 5.x, Jest → 29.x, and Apollo Client → 3.x.
Also introduce `react-router-dom` type augmentation via `custom-types/react-router-dom.d.ts`, and add `compilerOptions.paths` overrides in `tsconfig.json` for `react`, `react-dom`, `react-dom/client`, and `react/jsx-runtime` — a workaround for nested `@types/react` directories (inside `@types/react-router`, `@types/react-router-dom`, and `@types/react-redux`) that pin older type definitions and produce `ReactNode`/`bigint` mismatches. The override forces every module to resolve against the top-level `@types/react@18.x`. The override stays until Phase 4 retires `@types/react-router*` and Phase 10 retires `@types/react-redux`.

## [x] Phase 2 — TypeScript Strict Mode & Lint Cleanup

Enable `strict: true` and fix all 2464 type errors across 14 incremental phases with no `@ts-ignore` / `any` escape hatches, and set `allowJs: true` in `tsconfig.test.json` so `.jsx` tests compile.
Bump `@typescript-eslint/{parser,eslint-plugin}` v4 → v5.62 to fix a parser bug that silently dropped legacy decorators from the AST and produced 196 false-positive `no-unused-vars` errors; clear the remaining lint errors down to zero.

## [x] Phase 3 — Test Suite Rewrite & Fixes (React 18 + Apollo v3)

Replace ~90 `container.firstChild` assertions across 71 files with meaningful queries, migrate `@apollo/react-testing` → `@apollo/client/testing`, extend the `jspdf` mock, and normalize `rangeEnd/rangeStart` across helpers and mapper tests.
Also fix pre-existing failures (`SuppressedUsers`, `DownloadStaticCSVReport`, `LifecycleContext`, `ExportLogModal`, `DateInput`) by adjusting mocks, moving snapshots to `document.body` for portal-rendered modals, and swapping `@testing-library/react-hooks` for the React 18-compatible `renderHook` from `@testing-library/react`.

## [x] LPD-77522 — Phase 4 — React Router v5 → v7 Migration

Migrated `react-router-dom` v5.2 → v7.14. Replaced `<Switch>` with `<Routes>` (aliased locally as `RouterRoutes` to avoid colliding with the `Routes` constant in `shared/util/router`); rewrote `BundleRouter` as `BundleElement` (used as `<Route element={<BundleElement ...>} path={...} />`) across ~107 call sites; migrated `useHistory` → `useNavigate`, `<Redirect>` → `<Navigate>`, `<Prompt>` → a new `useUnsavedChangesPrompt` hook backed by `useBlocker`. The `withRouter` HOC was removed from `react-router-dom` imports and replaced by a local hook-based shim at `shared/hoc/WithRouter.tsx`; `withHistory` now delegates to that shim. Inline path-to-regexp constraints (e.g. `/:groupId([\\w._-]+)`) were stripped because v7 no longer supports the `:param(regex)` syntax — validation should now live in components when needed.
The `@types/react-router-dom` dep is gone (v7 ships types in-package). `custom-types/react-router-dom.d.ts` is kept as a small `useParams` augmentation only — it preserves the v5-style `useParams<{ key: string }>()` generic so call sites compile without changing each one to the v7 `<ParamKey extends string>` shape; this can be deleted once consumers migrate to defensive defaults like `useParams<{ groupId?: string }>()`.
The root router was switched from declarative `<BrowserRouter>` to `createBrowserRouter` + `<RouterProvider>` so `useBlocker` works for the unsaved-changes prompt; descendant route trees still live in ~20 nested `<Routes>` blocks (consolidating them is Phase 5). Each nested file uses a local `relativeRoute(parent, child)` helper to strip the parent prefix from absolute `Routes` constants, since v7 `<Routes>` only matches relative paths.

## [ ] TBD — Phase 5 — Consolidate Routes into `createBrowserRouter` Config

Phase 4 left the routing tree in a hybrid shape: the **root** uses `createBrowserRouter` + `<RouterProvider>`, but **descendants** still mount their own `<Routes>` blocks across ~20 files (`WorkspaceLayer`, `Settings`, `AppSidebarRoutes`, the asset / contact / individual / segment route files, etc.). This phase collapses the descendant trees into a single config so the codebase fully embraces the v7 data router model.

Concretely:

- Flatten the ~20 nested `<Routes>` blocks into one `createRoutesFromElements(...)` tree, either in `App.tsx` or a dedicated `routes.tsx`. Sub-routes become children of their parent `<Route>` and inherit the path prefix automatically.
- Delete `relativeRoute` (`shared/util/router.ts`) and the per-file shorthands introduced in Phase 4: `apisRel`, `defRel`, `settingsRel`, `wsRel`, `dpRel`, `usersRel`, `assetsRel`, `sitesRel`, `accountRel`, `indRel`, `indivRel`, `segRel`. Once paths inherit from parent routes, no prefix stripping is needed.
- Retire `BundleElement` (`route-middleware/BundleRouter.tsx`). It exists only to spread `useParams()` + `useQueryParams()` into legacy components as props (the v5 `BundleRouter` render-prop pattern). With direct `<Route element={<Component />} />`, components should call `useParams` / `useQueryParams` themselves. ~150 components are affected.
- Eliminate the `router={{params, query}}` prop shape (`BundleElement`'s `destructured={false}` mode). Consumers — mostly under `assets/`, `sites/`, `event-analysis/`, and the entity profile routes — should consume `useParams` / `useQueryParams` directly.
- Centralize 404 handling via the root route's `errorElement`. Drop the per-file `<RouteNotFound />` fallbacks and the `notFoundError` state check in `RoutesContainerLayout` — the data router routes errors to a single boundary.
- Replace the `tabId` / `typeId` switch blocks added during Phase 4 (in `assets/blog/pages/index.tsx`, `assets/document-and-media/pages/index.tsx`, `assets/form/pages/index.tsx`, `assets/web-content/pages/index.tsx`, `assets/object-entry/pages/index.tsx`, `sites/touchpoints/pages/TouchpointRoutes.jsx`) with proper sibling `<Route>` children — the parent path becomes a section root, and each tab is its own `<Route path="page" />` / `<Route path="known-individuals" />`. Same for the deprecated `:tabId(page|known-individuals)` patterns.
- Migrate ~80 test fixtures from `<MemoryRouter>` + `<Routes>` to `createMemoryRouter(routes, { initialEntries: [...] })` + `<RouterProvider>`. Update `test/mock-router.tsx` accordingly.
- Optional, opt-in per route as you touch them: route-level `lazy: () => import(...)` instead of top-of-file `React.lazy`, `loader` / `action` for data fetching, `<ScrollRestoration />` at the root, route-level `errorElement` for granular error boundaries.

The `Routes` constants object (`shared/util/router.ts`) stays — it remains the source of truth for `toRoute()` URL generation. Only the routing JSX changes.

Worth doing as a discrete follow-up to Phase 4 (rather than rolling into the v7 bump itself) because the consolidation requires component-level changes — removing `BundleElement` ripples through ~150 files. Splitting it out keeps the v7 bump itself reviewable.

## [ ] LPD-87324 — Phase 6 — Coverage Improvement & Snapshot Removal

Raise project coverage thresholds by adding unit tests for modules currently below the bar, prioritizing hooks, reducers, and shared utilities.
Replace brittle `toMatchSnapshot` assertions with explicit DOM/behavior checks and delete the corresponding `.snap` files to stop masking regressions.

## [ ] LPD-87325 — Phase 7 — JavaScript → TypeScript Conversion

Convert remaining `.js` / `.jsx` files under `src/main/js/` to `.ts` / `.tsx`, prioritizing hot paths and files touched often by feature work.
Once the last `.js`/`.jsx` is gone, remove `allowJs` from `tsconfig.json` and `tsconfig.test.json` so TypeScript enforces strict types across the whole module.

## [ ] LPD-87326 — Phase 8 — React Class Components → Functional Components

Convert remaining `class X extends React.Component` declarations to function components with hooks (`useState`, `useEffect`, `useMemo`, `useRef`), dropping legacy lifecycle methods.
This unblocks Phase 9 (most HOCs wrap class components) and aligns the codebase with the React 18 concurrent-mode model.

## [ ] LPD-87327 — Phase 9 — HOCs → Hooks Migration

Replace HOC wrappers in `shared/hoc/` and `*/hoc/` (e.g. `withHistory`, `withRouter`, `withOnboarding`, `withAdminPermission`, `withQueryPagination`, `withBaseResults`) with equivalent custom hooks under `shared/hooks/`.
Remove the legacy `autobind-decorator`, `autoCancel`, `hasRequest`, `debounce` decorator toolkit once no class component references them.

## [ ] LPD-87328 — Phase 10 — Redux → React Context API

Replace Redux-managed slices (`shared/reducers/`, `shared/actions/`, `connect` / `mapStateToProps` bindings) with React Context + hook-based state, keeping the Apollo cache for all GraphQL data.
Retire `redux`, `react-redux`, `redux-immutable`, and related middleware once no component imports them, and drop the `Immutable.Map` root-state assumption from selectors and tests.
Removing `@types/react-redux` also eliminates the last nested `@types/react` copy — after this phase the `compilerOptions.paths` workaround in `tsconfig.json` (from Phase 1) can be deleted.

## [ ] LPD-87329, LPD-43280 — Phase 11 — Drop Internet Explorer Support

Bump Webpack/Babel targets to a modern browserslist (remove IE11 from `package.json` / `.browserslistrc`), drop `core-js` polyfills that only exist for IE, and change `tsconfig.json` `target` from `ES5` to `ES2020`+.
Remove IE-specific workarounds scattered across the codebase (CSS `-ms-*` prefixes, `Object.assign` polyfills, feature-detection branches).

## [ ] LPD-87330 — Phase 12 — Align ESLint Config with Liferay DXP

Migrate `.eslintrc.js` to extend the shared ESLint configuration used across Liferay DXP frontend modules, replacing the module-local rule set.
This reduces rule conflicts ahead of the upcoming site-initializer migration and keeps code formatting consistent with the rest of the Liferay portal modules.

## [ ] LPD-87331 — Phase 13 — Re-enable Pedantic Console Mode in Tests

Fix the underlying deprecations currently silenced in `src/main/js/test/setup.js` so the `pedantic.enable()` guard can be restored (throws on any `console.error` / `console.warn` during tests). Known sources:
- Apollo Client v3.14 deprecations: `addTypename` on `InMemoryCache` and `MockedProvider`, `connectToDevTools` option, `graphql` HOC and `<Query />` component (covered by Phase 9), cache merge policy warnings for entities like `SiteMetric` / `Query.site`.
- React 18 `ReactDOMTestUtils.act` warning — resolve by upgrading `@testing-library/react` to v14+ which uses `React.act`.
- Residual component-level warnings surfaced only after the silence is lifted.

## [ ] LPD-43282 — Phase 14 — Disable SASS Source Maps in Production

Disable SASS / CSS source map generation for production builds. Source maps help during development but inflate the production bundle and leak implementation details; flip `sass-loader`, `css-loader`, and `postcss-loader` to `sourceMap: false` in the production webpack config and keep them on for `yarn start` / `yarn webpack:dev`.

## [ ] LPD-43283 — Phase 15 — Replace `moment-timezone`

Remove the `moment-timezone` dependency — currently one of the largest single entries in the bundle — in favor of a lighter alternative (native `Intl.DateTimeFormat` or `date-fns-tz` with a pre-filtered zone list).
Audit every call site, migrate it to the replacement API, and delete the package from `package.json`. Timezone-sensitive tests must still pass under `TZ=Etc/GMT`.

## [ ] LPD-43284 — Phase 16 — Exclude the `ui-kit` Page from Production

Guard the internal `ui-kit` preview route so its chunks are not shipped to production. Gate the entry (and any lazy-loaded components it pulls) behind a `DEVELOPER_MODE` / `FARO_DEV_MODE` check so webpack tree-shakes it in production, while keeping the page reachable under `yarn start` for developers.

## [ ] LPD-43286 — Phase 17 — Shrink `sprite.svg`

Audit `assets/icons/` and remove icons that no longer appear in any component. The `svg-sprite-loader` currently emits every icon in the folder into a single sprite referenced by `ClayIconSpriteContext`; unused icons inflate the asset for no benefit. Verify no broken `<svg><use xlink:href=...>` references remain after the cleanup.

## [ ] LPD-43287 — Phase 18 — Clean Up `main.scss`

Remove dead selectors, duplicated imports, and legacy overrides from the root `main.scss` file. Relocate component-scoped rules into the owning component stylesheets so `main.scss` is limited to genuinely global styles. The final production CSS should be smaller with no visual regressions.

## [ ] LPD-77748 — Phase 19 — Remove `react-loadable`

Retire the `react-loadable` dependency. `React.lazy` + `Suspense` is already the dominant lazy-loading pattern across `App.tsx` and the workspace sub-app, making `react-loadable` redundant. Migrate any remaining call sites to `React.lazy` and drop the package from `package.json`.

Completed build-performance items already shipped under LPD-43277: Webpack filesystem cache (`LPD-43278`), `thread-loader` parallelization (`LPD-43279`), and `optimization.splitChunks` tuning (`LPD-43281`).
