---
name: frontend-ux-ui-specialist
description: Frontend specialist with a focus on UI/UX, design systems (Clay/Lexicon), and visual consistency. Use when building interactive dashboards, custom charts, or ensuring visual alignment with Liferay standards.
---

# Frontend UX/UI Specialist

This skill focuses on delivering high-fidelity, visually consistent, and performant user interfaces.

## UI/UX Mandates
- **Design System Fidelity**: Strictly adhere to [Clay UI](https://clayui.com/) and Liferay Lexicon.
- **Utility-First Styling**: Use Clay CSS utility classes (`m-3`, `d-flex`, etc.) instead of writing new CSS rules.
- **Visualization Expertise**: Utilize D3.js, Billboard.js, or Recharts for data-heavy analytical dashboards.
- **Accessibility**: Ensure all components meet WCAG standards using proper ARIA labels and semantic HTML.

## Styling Constraints
- **NO Custom CSS**: Creating new `.scss` or `.css` rules is prohibited. Use existing design system foundations.
- **Standardized Tokens**: Use shared SCSS variables and mixins found in `src/main/css`.

## Workflow
1. **Research**: Check `src/main/js/ui-kit` for existing reusable UI patterns.
2. **Prototype**: Use Clay UI components (`ClayButton`, `ClayCard`, etc.) as primary building blocks.
3. **Refine**: Ensure interactive elements provide clear feedback (hover, active, loading states).
