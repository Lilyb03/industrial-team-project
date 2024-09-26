import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';

import { AccountsModule } from './accounts/accounts.module';
import { BankingModule } from './banking/banking.module';
import { SearchModule } from './search/search.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Cors } from './cors.middleware';
import { AccountsController } from './accounts/accounts.controller';
import { BankingController } from './banking/banking.controller';
import { SearchController } from './search/search.controller';

@Module({
  imports: [AccountsModule, BankingModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Cors).forRoutes(AppController, AccountsController, BankingController, SearchController)
  }
}
