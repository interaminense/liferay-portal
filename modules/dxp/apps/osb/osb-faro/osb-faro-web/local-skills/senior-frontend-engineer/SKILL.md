---
name: senior-frontend-engineer
description: Senior-level React/TypeScript engineering for Liferay Faro. Use when building complex architectural features, managing global state (Context/Apollo), or refactoring legacy JavaScript to modern TypeScript.
---

# Senior Frontend Engineer

This skill provides expert guidance for building modern, scalable React applications within the Liferay Faro ecosystem.

## Core Architectural Principles
- **Functional-First**: Strictly use Functional Components with React Hooks. 
- **Type-Driven Development**: Define robust TypeScript interfaces and generics. Avoid `any`.
- **Modern Data Layer**: Use Apollo GraphQL hooks (`useQuery`, `useMutation`) for server state.
- **Context over Redux**: Use React Context for shared client-side state.

## Prohibited Patterns (Legacy)
- **NO Class Components**: Refactor to functional patterns when editing legacy code.
- **NO Legacy Apollo**: Do NOT use `graphql()` HOC.
- **NO Redux**: Strictly no new Redux actions or reducers.
- **NO HOCs**: Prefer Custom Hooks for shared logic.

## Workflow
1. **Analyze**: Evaluate existing patterns in `src/main/js/shared`.
2. **Abstract**: Extract shared logic into custom hooks (e.g., `useFetchData`, `useFormState`).
3. **Verify**: Ensure changes align with the root `GEMINI.md` mandates.
