import { Module } from '@nestjs/common';
import { AccountsControllerGet } from './controllers/accounts/accounts.controller';
import { AccountsService } from './services/accounts/accounts.service';

@Module({
  controllers: [AccountsControllerGet],
  providers: [AccountsService]
})
export class ApiGetModule {}
