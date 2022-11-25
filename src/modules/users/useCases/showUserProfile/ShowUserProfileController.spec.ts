import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user profile", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "user",
        email: "user@example.com",
        password: "password",
      });

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@example.com",
        password: "password",
      });

    const { token } = responseToken.body

    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}`})

    expect(response.status).toBe(200);
  });

  it("should not be able to show a non existent profile", async () => {
    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer token invalid`});

    expect(response.status).toBe(401);
  });
});
