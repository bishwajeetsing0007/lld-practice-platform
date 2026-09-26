# LLDX Backend 2.1

Spring Boot modular monolith for the LLD practice platform.

## Run

PowerShell:

```powershell
cd D:\lld-practice-platform\backend
mvn clean package
mvn org.springframework.boot:spring-boot-maven-plugin:3.5.6:run
```

API: `http://localhost:8080/api/health`
H2 console: `http://localhost:8080/h2-console`
JDBC URL: `jdbc:h2:file:./data/lldx`

The seed creates Parking Lot, Vending Machine, Elevator and Splitwise.
