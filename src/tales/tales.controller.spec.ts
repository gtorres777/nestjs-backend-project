import { Test, TestingModule } from '@nestjs/testing';
import { TalesController } from './tales.controller';

describe('TalesController', () => {
  let controller: TalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalesController],
    }).compile();

    controller = module.get<TalesController>(TalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
