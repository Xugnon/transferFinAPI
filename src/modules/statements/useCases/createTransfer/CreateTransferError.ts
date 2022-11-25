import { AppError } from "../../../../shared/errors/AppError";


export namespace CreateTransferError {
  export class ReceivedUserNotFound extends AppError {
    constructor() {
      super('Received User Not Found!', 404);
    }
  }

  export class SendUserNotFound extends AppError {
    constructor() {
      super('Send User Not Found!', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient Funds!', 400);
    }
  }
}
