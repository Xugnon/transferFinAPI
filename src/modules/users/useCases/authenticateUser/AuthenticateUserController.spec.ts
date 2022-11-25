import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";


let connection: Connection;
describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "user",
        email: "user@example.com",
        password: "password",
      });

    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@example.com",
        password: "password",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able to authenticate a nonexistent user", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "false@example.com",
        password: "password",
      });

    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate with incorrect password", async () => {
    const response = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@example.com",
        password: "incorrect",
      });

    expect(response.status).toBe(401);
  });
});
