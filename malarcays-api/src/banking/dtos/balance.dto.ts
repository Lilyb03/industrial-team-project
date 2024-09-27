import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class BalanceDTO {
	@IsNotEmpty()
	@IsNumber()
	account: number;

	@IsOptional()
	@IsString()
	start_date: number;

	@IsOptional()
	@IsString()
	end_date: number;
}