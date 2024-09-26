import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { ValidateAccount } from './validateAccounts.middleware';

@Module({
	controllers: [AccountsController],
	providers: [AccountsService],
})
export class AccountsModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ValidateAccount)
			.forRoutes(AccountsController)
	}
}
