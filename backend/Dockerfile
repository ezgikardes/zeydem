# Render builds this file (decision 003). Two stages: the first compiles, the second only runs,
# so the image that goes live carries a JRE and the jar, not Maven and the sources.

# 1. Build: Maven and JDK 17 turn the sources into one runnable jar.
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
# The dependencies are downloaded before the sources are copied, so a change in the code alone
# reuses that layer instead of downloading everything again.
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
# Tests need the local test database, which the build does not have. They run before a push.
RUN mvn -q package -DskipTests

# 2. Run: only the Java runtime and the jar.
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
# Java takes a quarter of the memory by default; the free instance has 512 MB, so allow it more.
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
