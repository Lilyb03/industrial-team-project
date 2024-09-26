import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';

export enum AccountTypes {
  CUSTOMER = 'CUSTOMER',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN',
}

export class CreateAccountsDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsNotEmpty()
  @IsEnum(AccountTypes)
  type_id: AccountTypes;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
