import { Test, TestingModule } from '@nestjs/testing';
import { AccountsControllerGet } from './accounts.controller';

describe('AccountsController', () => {
  let controller: AccountsControllerGet;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsControllerGet],
    }).compile();

    controller = module.get<AccountsControllerGet>(AccountsControllerGet);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
