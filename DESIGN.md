# Design Note — LLDX v2
## Core journey
Problems → Design Workspace → Submit → Explainable Review → Challenge → Retry → Progress.

## Domain
Problem, Attempt, Submission evidence, Evaluation and Feedback are separate. Evaluation is behind `Evaluator`, allowing rule-based, AI or human review.

## State
DRAFT → SUBMITTED → EVALUATING → COMPLETED / FAILED.

## Change test A
Design evidence is isolated from evaluation, allowing future code or diagram submission formats.

## Change test B
The practice flow depends on `Evaluator`, allowing LLM or human review without rewriting the practice flow.

## Product differentiators
Design Challenge and Requirement Change test extensibility; Attempt History and Progress turn feedback into a learning loop.

## Scaling
Keep a modular monolith. If AI becomes slow, persist EVALUATING and move evaluation to a queue/worker first.
