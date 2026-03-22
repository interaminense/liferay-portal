# Liferay Analytics Cloud (Faro) - Project Mandates

This document defines the foundational mandates for Gemini CLI when working within the `osb-faro-web` module. These instructions take absolute precedence over general defaults.

## Project Overview
`osb-faro-web` is the primary frontend and portlet integration layer for Liferay Analytics Cloud. It is a hybrid application combining a modern React/TypeScript SPA with Liferay Portal's OSGi-based Java backend.

## Global Tech Stack
- **Frontend Core**: React 16.8 (Hooks), TypeScript 3.9+, Redux.
- **Data Layer**: Apollo Client (GraphQL) for primary data, REST for legacy/specific integrations.
- **UI Framework**: [Clay UI](https://clayui.com/) (Liferay's Design System) and Lexicon design language.
- **Styling**: Modular SCSS with a focus on reusable variables and mixins.
- **Backend**: Java 8+, OSGi, Liferay MVC Portlet.
- **Build/Tools**: Webpack 5, Gradle, NPM, ESLint, Prettier.

## Architectural Mandates
1. **Directory-Level Specialization**: Always look for an `AGENT.md` file when working within sub-directories. These files contain domain-specific constraints that override global defaults.
2. **Type Safety**: All new frontend code MUST be written in TypeScript. Pure JavaScript is strictly for legacy maintenance. Avoid `any` at all costs.
3. **Component Reusability**: Before building a new UI component, check `src/main/js/shared/components` for existing patterns. Follow the "Atomic Design" philosophy.
4. **State Management**: Use Apollo Hooks (`useQuery`, `useMutation`) for server-state. Strictly NO new `react-redux` logic; use React Context or Apollo local state for new shared state.

## Strictly Prohibited Patterns
1. **No Class Components**: All new React components MUST be Functional Components using Hooks.
2. **No Legacy Apollo HOCs**: Do NOT use the `graphql()` function/HOC from Apollo. Use Apollo Hooks instead.
3. **No New HOCs**: Higher-Order Components are deprecated in favor of Custom Hooks.
4. **No New CSS/SCSS**: Do NOT create new CSS rules. Always utilize [Clay UI](https://clayui.com/) standard classes, utilities, and Lexicon design patterns.
5. **No New Redux**: Creating new Redux actions, reducers, or store slices is prohibited.

## Engineering Standards
- **Linting & Formatting**: Run `npm run format` before finalizing any frontend changes. Adhere to `eslint-config-liferay`.
- **Naming Conventions**: 
  - React Components: PascalCase.
  - Utilities/Hooks: camelCase.
  - SCSS Files: `_snake_case.scss` for partials.
- **Testing**: 
  - Frontend: Jest + React Testing Library. No change is complete without a corresponding `.spec.ts(x)` or `__tests__` entry.
  - Backend: JUnit + Mockito.

## Workflow & Verification
1. **Research**: Empirical reproduction of bugs is mandatory. Use `npm test` or `./gradlew test` to verify the failure state.
2. **Strategy**: Propose changes that align with existing Liferay OSGi and React patterns.
3. **Execution**: Perform surgical updates. Ensure `package.json` scripts are used for validation.
4. **Validation**: Run `npm run lint` and `npm test` for every frontend change. Ensure `bnd.bnd` is updated if Java dependencies change.

## Security & Integrity
- Never commit or log API keys, tokens, or PII.
- Protect `.env` and `test.properties` files.
- Ensure all new OSGi services are properly scoped and documented.
