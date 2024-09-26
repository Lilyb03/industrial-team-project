import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CompanyDTO {
	@IsNotEmpty()
	@IsString()
	category: string;
}