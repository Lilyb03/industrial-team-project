import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class LoginDto {
	@IsNumber()
	account: number;

	@IsNotEmpty()
	@IsString()
	password: string;
}