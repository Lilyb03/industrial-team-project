import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './api/api.controller';

describe('AppController', () => {
  let appController: AppController;
  let apiController: ApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    apiController = app.get<ApiController>(ApiController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(apiController.ping()).toBe('Hello World!');
  //   });
  // });
});
