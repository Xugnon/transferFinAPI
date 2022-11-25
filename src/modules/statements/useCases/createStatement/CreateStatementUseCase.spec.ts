import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository, inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const user: ICreateUserDTO = ({
      name: "testName",
      email: "test@example.com",
      password: "password",
    });

    const { id } = await createUserUseCase.execute(user);

    const statement = await createStatementUseCase.execute({
      user_id: id as string,
      type: "deposit" as any,
      amount: 1000,
      description: "test description",
    });

    expect(statement).toHaveProperty("id")
  });

  it("should not be able to create a new statement to a nonexisting user", async () => {
    expect(async () => {
      const user: ICreateUserDTO = ({
        name: "test1",
        email: "test@example.com",
        password: "password",
      });

      await createUserUseCase.execute(user);

      await createStatementUseCase.execute({
        user_id: "testId",
        type: "deposit" as any,
        amount: 1000,
        description: "test description",
      });

    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new statement with insufficient amount", async () => {
    expect(async () => {
      const user: ICreateUserDTO = ({
        name: "test1",
        email: "test@example.com",
        password: "password",
      });

      const { id } = await createUserUseCase.execute(user);

      await createStatementUseCase.execute({
        user_id: id as string,
        type: "deposit" as any,
        amount: 200,
        description: "test description",
      });

      await createStatementUseCase.execute({
        user_id: id as string,
        type: "withdraw" as any,
        amount: 300,
        description: "test1 description",
      });

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
})
