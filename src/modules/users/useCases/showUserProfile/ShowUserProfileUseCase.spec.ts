import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "test1",
      email: "test@example.com",
      password: "password",
    });

    const users = await showUserProfileUseCase.execute(user.id as string);

    expect(users).toEqual(user);
  });

  it("should not be able to show user profile with nonexistent id", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("idTest");

    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
