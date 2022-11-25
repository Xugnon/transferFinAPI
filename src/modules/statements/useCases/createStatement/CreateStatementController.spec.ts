import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to deposit", async () => {
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

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "depositTest",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should be able to withdraw", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@example.com",
        password: "password",
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 200,
        description: "withdrawTest",
      })
      .set({ Authorization: `Bearer ${token}`});

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to withdraw with enough funds", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@example.com",
        password: "password",
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 400,
        description: "enough_funds_test"
      })
      .set({ Authorization: `Bearer ${token}`});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should not be able to create a new statement to a nonexisting user", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "fakeId",
      })
      .set({ Authorization: `Bearer token invalid`});

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  })
});
