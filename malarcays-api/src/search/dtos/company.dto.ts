import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CompanyDTO {
	@IsNotEmpty()
	@IsString()
	name: string;
}