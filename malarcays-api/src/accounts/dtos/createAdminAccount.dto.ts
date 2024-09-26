// createAdminAccount.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateAccountsDTO } from './createAccounts.dto';

export class CreateAdminAccountDTO extends CreateAccountsDTO {
  @IsNotEmpty()
  @IsString()
  admin_role: string;
}
