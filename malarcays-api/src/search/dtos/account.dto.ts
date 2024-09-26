import { IsNumber, IsOptional, IsString } from "class-validator";

export class AccountDTO {
	@IsOptional()
	@IsNumber()
	account: number;

	@IsOptional()
	@IsString()
	name: string;
}