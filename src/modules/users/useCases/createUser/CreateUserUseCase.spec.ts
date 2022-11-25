import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";



let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Crate User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Test1",
      email: "test@example.com",
      password: "12345"
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user with exists email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "Test1",
        email: "test@example.com",
        password: "12345"
      });

      await createUserUseCase.execute({
        name: "Test2",
        email: "test@example.com",
        password: "54321"
      });

    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
