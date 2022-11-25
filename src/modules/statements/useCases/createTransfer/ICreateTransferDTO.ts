export interface ICreateTransferDTO {
  sendUserId: string;
  receiveUserId: string;
  description: string;
  amount: number;
}
