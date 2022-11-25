import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statement operation", async () => {
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

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 500,
        description: "depositTest",
      })
      .set({ Authorization: `Bearer ${token}` });

    const statement_id = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}`})

    const { id } = statement_id.body.statement[0];

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
  });

  it("should not be able to get a statement to a nonexistent user", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@example.com",
        password: "password",
      });

    const { token } = responseToken.body;

    const statement_id = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}`})

    const { id } = statement_id.body.statement[0];

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({ Authorization: `Bearer token invalid` });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  })
});
