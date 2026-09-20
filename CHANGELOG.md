# Changelog

## [1.1.0] - 2026-09-20

### Fixed

- Unsubscribing twice no longer removes another listener. Listeners added or removed during dispatch no longer disrupt delivery of the current event.

### Changed

- Remove the ignored EventProvider events prop. The provider observes responder capture within its view subtree; event names were never used to filter native input.
- Hook dependencies accept readonly arrays, and direct subscriptions expose their cleanup function in TypeScript.
- Declare the existing React Hooks requirement as React >=16.8.0.
