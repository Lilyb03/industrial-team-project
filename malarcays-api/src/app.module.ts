import { Module } from '@nestjs/common';

import { AccountsModule } from './accounts/accounts.module';
import { BankingModule } from './banking/banking.module';
import { SearchModule } from './search/search.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [AccountsModule, BankingModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
