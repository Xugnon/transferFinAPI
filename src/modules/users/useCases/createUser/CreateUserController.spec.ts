import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { app } from "../../../../app";

let connection: Connection;
describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "testUser",
        email: "testUser@example.com",
        password: "testPassword",
      });

    expect(response.statusCode).toBe(201);
  });

  it("should should not be able to create a new user with exists email", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "testUser1",
        email: "testUser@example.com",
        password: "testPassword",
      });

    expect(response.statusCode).toBe(400);
  });
});
