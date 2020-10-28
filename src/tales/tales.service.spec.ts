import { Test, TestingModule } from '@nestjs/testing';
import { TalesService } from './tales.service';

describe('TalesService', () => {
  let service: TalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TalesService],
    }).compile();

    service = module.get<TalesService>(TalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
