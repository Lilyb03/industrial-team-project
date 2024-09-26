import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AccountsController } from './controllers/accounts/accounts.controller';
import { AccountsService } from './services/accounts/accounts.service';
import { ValidateAccount } from './middlewares/validateAccounts.middleware';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateAccount)
      .forRoutes(AccountsController)
  }
}
