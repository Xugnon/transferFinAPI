import { send } from "process";
import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../enum/OperationType";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
  ) {}

  async execute({
    description,
    amount,
    sendUserId,
    receiveUserId
  }: ICreateTransferDTO): Promise<void> {
    const receivedUser = await this.usersRepository.findById(receiveUserId);
    if (!receivedUser) {
      throw new CreateTransferError.ReceivedUserNotFound();
    };

    const sendUser = await this.usersRepository.findById(sendUserId);
    if (!sendUser) {
      throw new CreateTransferError.SendUserNotFound();
    };

    const { balance } = await this.statementsRepository.getUserBalance({user_id: sendUserId});
    if (balance <= amount) {
      throw new CreateTransferError.InsufficientFunds();
    };

    await this.statementsRepository.create({
      user_id: sendUser.id as string,
      description,
      amount: amount * -1,
      type: OperationType.TRANSFER,
    });


    await this.statementsRepository.create({
      user_id: receivedUser.id as string,
      description,
      amount: amount,
      type: OperationType.TRANSFER,
    });
  }
}
