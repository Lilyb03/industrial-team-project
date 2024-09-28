import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class TransactionDTO {
	@IsNotEmpty()
	@IsNumber()
	sender: number;

	@IsNotEmpty()
	@IsNumber()
	recipient: number;

	@IsNotEmpty()
	@IsNumber()
	amount: number;

	@IsNotEmpty()
	@IsString()
	reference: string;
}