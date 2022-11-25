import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";


export class CreateTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id: receiveUserId } = request.params;
    const { amount, description } = request.body;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const statement = createTransferUseCase.execute({
      amount,
      description,
      receiveUserId,
      sendUserId: request.user.id
    })

    return response.status(201).json(statement);
  }
}
