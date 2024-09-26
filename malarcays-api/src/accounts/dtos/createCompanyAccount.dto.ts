// createCompanyAccount.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateAccountsDTO } from './createAccounts.dto';

export class CreateCompanyAccountDTO extends CreateAccountsDTO {
  @IsNotEmpty()
  @IsNumber()
  company_id: number;
}
