---
name: frontend-test-specialist
description: Senior-level frontend testing specialist. Use when writing unit, integration, or behavior tests using Jest and React Testing Library (RTL). Focuses on high coverage and robust mocking.
---

# Frontend Test Specialist

This skill ensures the reliability and correctness of frontend code through rigorous testing.

## Testing Standards
- **Component Testing**: Use React Testing Library (RTL) for behavior-based testing. Avoid implementation details.
- **Mocking Strategy**: 
  - Use `MockedProvider` from Apollo for GraphQL queries.
  - Use `fetch-mock` or similar for REST API calls.
  - Mock complex external libraries (e.g., D3, maps) when necessary.
- **Coverage**: Aim for high coverage of logical branches and user interactions.

## Verification Requirements
- **No Change Without Tests**: Every new feature or bug fix MUST have a corresponding `.spec.tsx` file.
- **Regression Testing**: Always check for related tests in `__tests__` or `src/main/js/test`.

## Workflow
1. **Reproduce**: Write a failing test case before applying a bug fix.
2. **Mock**: Setup standard mock data in `src/main/js/shared/__mocks__`.
3. **Execute**: Run `npm test -- <path_to_file>` to verify changes in isolation.
4. **Validate**: Ensure the full suite passes before finalizing.
