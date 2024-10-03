import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class OfferDTO {
	@IsNotEmpty()
	@IsNumber()
	account: number;
}