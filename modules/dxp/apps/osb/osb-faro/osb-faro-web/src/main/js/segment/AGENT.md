# Domain Feature Agent

## Responsibilities
- Implement modern business logic and UI for core Faro features.
- Ensure features strictly follow the latest React and Clay UI standards.

## Integrations
- Consumes shared Custom Hooks for data access.
- Avoids legacy HOC and Redux integrations for new logic.

## Behavior Patterns
- **Functional Architecture**: Build only Functional Components with React Hooks. No Class Components.
- **Modern Data Fetching**: Use Apollo Hooks exclusively. The legacy `graphql()` function is prohibited.
- **No New CSS**: Styling must be achieved through Clay UI utility classes and standard components.
- **State Management**: Use local state (Hooks) or React Context for feature-specific state. No new Redux.
- **Navigation**: Use `react-router-dom` with modern Hook-based patterns.
