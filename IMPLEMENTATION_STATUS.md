# LLDX Industry MVP — Implementation Status

## Implemented end-to-end
- Spring Boot 3.5.6 modular monolith
- H2 persistent database for zero-setup demo
- Seeded LLD problem library: Parking Lot, Vending Machine, Elevator, Splitwise
- Attempt lifecycle: DRAFT → EVALUATING → COMPLETED / FAILED model
- Persistent structured design fields
- Rule-based evaluator with five rubric dimensions
- Stored evaluation + feedback JSON
- Design Challenge response endpoint + deterministic evaluation
- Requirement Change response endpoint + deterministic evaluation
- Attempt comparison endpoint with score movement
- Progress endpoint with average/completion/recommendation data
- React problem explorer with search and difficulty filters
- Structured design editor with saved draft state
- Persisted diagram elements
- Review dashboard with evidence/concern/suggestion per rubric
- Attempt history
- Progress/weakness dashboard
- Dark/light mode
- Responsive UI
- Error handling and CORS

## Prepared extension point
- `AiEvaluator` implements the same `Evaluator` strategy contract. Configure an LLM provider later without changing the practice API contract.

## Run
Backend:
```powershell
cd D:\lld-practice-platform\backend
mvn clean package
mvn org.springframework.boot:spring-boot-maven-plugin:3.5.6:run
```

Frontend:
```powershell
cd D:\lld-practice-platform\frontend
npm install
npm run dev
```

Then open `http://localhost:5173`.
