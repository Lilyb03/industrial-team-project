import { IsString, IsNumber } from 'class-validator';

export class LoginDto {
	@IsString()
	name: string;

	@IsNumber()
	account: number;

	@IsString()
	password: string;
}