# DEVELOPMENT_RULES.md

## General Rules

- Keep code simple and maintainable
- Prefer clarity over cleverness
- Use strict typing
- Build incrementally
- Avoid premature optimization
- Avoid unnecessary dependencies

## Angular Rules

- Use standalone components
- Use route-based feature organization
- Prefer reactive forms
- Use services for business logic
- Keep components lean
- Keep templates readable
- Avoid giant God services

## Data & State Rules

- Use small, focused interfaces
- Keep persistence strategy abstract enough to change later
- Use LocalStorage initially
- Do not introduce NgRx unless clearly needed

## Firebase Rules

- Use modular SDK
- Keep Firebase initialization centralized
- Never expose private credentials
- Treat VAPID key as environment configuration
- Handle unsupported platforms gracefully

## PWA Rules

- Ensure installability
- Ensure service worker configuration is explicit
- Ensure iOS guidance exists
- Ensure banners do not block normal app usage

## UI Rules

- mobile-first
- clean spacing
- reusable shared components
- empty/loading/error states required
- role-specific UI must be explicit and easy to understand

## GitHub Rules

This project is hosted on GitHub.

Therefore:
- never commit secrets
- keep project structure clean
- use clear file naming
- keep README quality high
- keep scripts predictable

## Testing Rules

At minimum, include:
- service unit tests where meaningful
- QR parsing tests
- local persistence tests if simple
- messaging service basic tests where feasible

## Developer Experience Rules

- create clear interfaces
- add comments only where valuable
- avoid noisy comments
- keep folder names intuitive
- provide mock services if backend is not complete

## Product Rules

Remember the product is intentionally lightweight.
Do not build enterprise-grade auth or permission systems unless explicitly requested later.
