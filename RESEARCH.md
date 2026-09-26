# Research Note

## Learner problem
LLD practice is easy to start but difficult to self-evaluate. A learner may create classes and relationships without knowing whether responsibilities are cohesive, abstractions are justified, or the design will survive changing requirements.

## Existing approaches
Common approaches include interview-preparation platforms, written LLD problem collections, UML/diagramming tools, and AI-assisted interview practice. They generally provide one or more of:
- problem statements,
- reference solutions,
- live practice,
- diagrams,
- code execution,
- tests,
- rubric or AI feedback.

## Gap identified
A focused practice loop can be simpler: the learner needs enough structured evidence of a design to receive useful feedback, but does not need a complete LMS or a sophisticated collaborative UML editor.

## Product direction
The MVP focuses on:

**Choose problem -> design -> submit -> explainable feedback -> review -> retry**

The submission captures assumptions, classes/responsibilities, relationships, patterns, trade-offs, and optional diagram text.

## Evaluation direction
A reference solution should not be treated as the only correct solution. The evaluator therefore uses dimensions such as requirement understanding, responsibility quality, abstraction, coupling/cohesion, extensibility, patterns, and testability.

Deterministic checks are used for required fields and state transitions. Judgment-heavy evaluation is isolated behind an evaluator interface so an LLM or human evaluator can be added later.

## MVP boundary
The prototype deliberately excludes authentication, payments, a large question bank, complex diagram editing, microservices, Kubernetes, and other HLD concerns.
