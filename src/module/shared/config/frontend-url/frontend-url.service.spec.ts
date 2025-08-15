import { Test, TestingModule } from '@nestjs/testing';
import { FrontendUrlService } from './frontend-url.service';

describe('FrontendUrlService', () => {
  let service: FrontendUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrontendUrlService],
    }).compile();

    service = module.get<FrontendUrlService>(FrontendUrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
