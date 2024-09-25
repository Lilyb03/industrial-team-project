import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { ApiGetModule } from './api-get/api-get.module';

@Module({
  imports: [ApiModule, ApiGetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
