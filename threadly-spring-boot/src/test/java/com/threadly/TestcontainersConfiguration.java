package com.threadly;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfiguration {

  // -----------------------
  // PostgreSQL container
  // -----------------------
  @Bean
  @ServiceConnection
  PostgreSQLContainer<?> postgresContainer() {
    PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
        DockerImageName.parse("postgres:16"))
        .withDatabaseName("mydatabase")
        .withUsername("myuser")
        .withPassword("secret");
    postgres.start();
    return postgres;
  }

  // -----------------------
  // RabbitMQ container
  // -----------------------
  @Bean
  @ServiceConnection
  RabbitMQContainer rabbitContainer() throws Exception {
    RabbitMQContainer rabbit = new RabbitMQContainer(DockerImageName.parse("rabbitmq:4-management"))
        .withExposedPorts(5672, 15672)
        .withUser("guest", "guest");
    rabbit.start();

    // Pre-create the queue required by your app
    rabbit.execInContainer(
        "rabbitmqctl", "add_queue", "post.seo.complete.queue"
    );

    return rabbit;
  }

  // -----------------------
  // SpiceDB container with migration
  // -----------------------
  @Bean
  public GenericContainer<?> spiceDbContainer(PostgreSQLContainer<?> postgres) throws Exception {
    // Step 1: Run migration
    GenericContainer<?> migrate = new GenericContainer<>(
        DockerImageName.parse("authzed/spicedb:v1.31.0"))
        .withCommand("spicedb", "datastore", "migrate", "head",
            "--datastore-engine=postgres",
            "--datastore-conn-uri=" + getPostgresUri(postgres))
        .withReuse(false)
        .waitingFor(Wait.forListeningPort().withStartupTimeout(java.time.Duration.ofSeconds(60)))
        .withStartupTimeout(java.time.Duration.ofSeconds(30));
    migrate.start();

    // Step 2: Run SpiceDB
    GenericContainer<?> spicedb = new GenericContainer<>(
        DockerImageName.parse("authzed/spicedb:v1.31.0"))
        .withExposedPorts(50051, 8443)
        .withCommand(
            "serve",
            "--log-level=debug",
            "--grpc-preshared-key=devkey",
            "--datastore-engine=postgres",
            "--datastore-conn-uri=" + getPostgresUri(postgres),
            "--http-enabled=true"
        )
        // wait until gRPC port is available
        .waitingFor(Wait.forListeningPort().withStartupTimeout(java.time.Duration.ofSeconds(60)))
        .withReuse(false);

    spicedb.start();
    return spicedb;
  }

  private String getPostgresUri(PostgreSQLContainer<?> postgres) {
    return String.format(
        "postgres://%s:%s@%s:%d/%s?sslmode=disable",
        postgres.getUsername(),
        postgres.getPassword(),
        postgres.getHost(),
        postgres.getFirstMappedPort(),
        postgres.getDatabaseName()
    );
  }
}
