# Liferay Site LDP Site Initializer

This module is a Liferay Site Initializer for the **Liferay Data Platform (LDP)**. When applied, it creates a fully configured site with a home page that hosts the Analytics Cloud frontend application (originally from `osb-faro-web`).

---

## Why This Module Is Structured Differently

Most site initializer modules that include frontend code follow the standard Liferay pattern:

- Build toolchain: `@liferay/node-scripts`
- Part of the global `modules/` npm/yarn workspace

This module intentionally deviates from that pattern. Here is why.

### The osb-faro-web Build Toolchain

The Analytics Cloud frontend (`osb-faro-web`) is a large React single-page application with a complex dependency graph — Redux, Apollo/GraphQL, React Router, lazy-loaded code splitting, SVG sprites, and more. Its build pipeline is a custom webpack configuration that is fundamentally incompatible with `@liferay/node-scripts` without significant refactoring.

To host this frontend during the migration phase without breaking it, this module mirrors the same webpack-based setup that `osb-faro-web` uses. This means:

- A custom `webpack.common.js` + `webpack.prod.js` instead of node-scripts
- `ts-loader` for TypeScript/JSX transpilation
- `MiniCssExtractPlugin` for CSS bundling
- Output to `src/main/resources/META-INF/resources/dist/`

### Excluded from the Global Workspace

This module is explicitly excluded from the `modules/package.json` npm workspace:

```json
"!apps/site/site-ldp-site-initializer"
```

The global workspace's root `yarnInstall` Gradle task passes `--network-timeout 120000` as two separate arguments, which npm misparses as a package name (`120000@*`), causing the install to fail. Excluding this module avoids that conflict entirely.

### Self-Managed Node.js + Yarn

Because the module is outside the global workspace, it manages its own Node.js and Yarn installation via dedicated Gradle tasks in `build.gradle`:

| Task | Purpose |
|---|---|
| `ldpYarnInstall` | Installs dependencies using the module's own Yarn (1.22.19) and Node (18.18.0) |
| `ldpYarnWebpack` | Runs `yarn webpack` to produce the bundle |

This is the same pattern used by `osb-faro-web` (`osbYarnInstall` / `osbYarnWebpack`).

---

## Build and Development

### Prerequisites

No manual Node or Yarn installation is required. Gradle downloads and manages Node 18.18.0 and Yarn 1.22.19 for this module automatically.

### Build

```bash
# Install dependencies and build the webpack bundle
cd modules/apps/site/site-ldp-site-initializer
yarn          # or: yarn install
yarn webpack  # produces dist/main.js and dist/main.css
```

### Deploy

```bash
./gradlew :modules:apps:site:site-ldp-site-initializer:deploy
```

Gradle automatically runs `ldpYarnInstall` → `ldpYarnWebpack` → `processResources` before packaging the JAR. No manual webpack invocation is needed for a full deploy.

### Bundle Output

The webpack bundle is written to:

```
src/main/resources/META-INF/resources/dist/main.js
src/main/resources/META-INF/resources/dist/main.css
```

These files are packaged inside the OSGi JAR and served by Liferay at:

```
/o/site-ldp-site-initializer/dist/main.js
/o/site-ldp-site-initializer/dist/main.css
```

The portlet's `view.jsp` loads the bundle and mounts the React app into `<div id="ldpApp">`.

---

## Migration

The Analytics Cloud frontend is being moved from `osb-faro-web` into this site initializer in two phases.

### Phase 1 — Current State: Migrate the App As-Is

The `osb-faro-web` React application is very large. A full architectural migration to the Liferay site-initializer conventions cannot happen in a single step without significant risk.

The current approach is to **move the existing frontend code incrementally** into `src/main/js/`, keeping the webpack build pipeline intact. The app runs exactly as it did inside `osb-faro-web`, but is now owned and deployed by this site initializer module — decoupling it from the portlet's deployment lifecycle.

### Phase 2 — Future: Migrate to Site Initializer Conventions

Once the codebase is fully moved and stabilized here, the following changes will be made to align with the standard Liferay site initializer pattern:

- Replace `webpack.common.js` / `webpack.prod.js` with `@liferay/node-scripts`
- Re-add the module to the global `modules/` npm workspace
- Remove `ldpYarnInstall` / `ldpYarnWebpack` from `build.gradle`
- Introduce site-initializer-native features: fragment collections, layout templates, portlet preferences, and structured content
