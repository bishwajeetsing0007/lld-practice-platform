# LLDX — LLD Practice Platform v2

Industry-style MVP for **Discover → Design → Review → Challenge → Improve**.

## Backend
```powershell
cd D:\lld-practice-platform\backend
mvn clean package
mvn org.springframework.boot:spring-boot-maven-plugin:3.5.6:run
```

## Frontend
Open another terminal:
```powershell
cd D:\lld-practice-platform\frontend
npm install
npm run dev
```
Open the Vite URL, normally http://localhost:5173.

## Demo
Problem Explorer → structured Design Workspace → Diagram → Submit → Rubric Review → Design Challenge → Requirement Change → My Attempts → Progress.

## Architecture
Spring Boot modular monolith with `Evaluator` as a strategy boundary: `RuleBasedEvaluator` today; `AiEvaluator` and future human evaluation can be added without rewriting the practice flow.
