+# DemonClaw intelligence runtime

DemonClaw is a Rust-native runtime for controlled purple-team and defensive
operations. This public note describes the engineering direction represented by
the project; it is not a client report, deployment guarantee, or authorization
to test a system.

## What the project demonstrates

- Policy gates around security tooling and operator decisions.
- Constrained WASM execution for selected workloads.
- Evidence collection that can be reviewed after an authorized engagement.
- Persistent state for tracking approved operations and their outcomes.
- Reporting that keeps the target, action, decision, and evidence connected.

## Operational limits

DemonClaw is intended for authorized, supervised use. Constrained execution
reduces the available authority but does not make arbitrary code safe by
itself. Scope, credentials, data handling, and approval remain the operator’s
responsibility.
