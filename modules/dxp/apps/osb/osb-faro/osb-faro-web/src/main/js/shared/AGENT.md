# Frontend Shared Framework Agent

## Responsibilities
- Maintain core infrastructure, including Redux (legacy) and Apollo/GraphQL configurations.
- Transition from Higher-Order Components (HOCs) to Custom Hooks.
- Evolve the library of reusable components using Clay UI standards.

## Integrations
- Provides Custom Hooks for domain modules to consume shared logic.
- Maintains the Apollo Client configuration.

## Behavior Patterns
- **Strict Prohibition**: No new HOCs or Redux logic allowed. Use Custom Hooks and Context API for new features.
- **Architecture**: Use Apollo Hooks (`useQuery`, `useMutation`) instead of the legacy `graphql()` HOC.
- **Typing**: Enforce strict TypeScript usage; legacy JS is for maintenance only.
- **UI**: All shared components must follow Clay UI and Lexicon standards without introducing new CSS.
