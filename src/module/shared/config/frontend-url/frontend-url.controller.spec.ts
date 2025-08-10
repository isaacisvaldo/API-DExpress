import { Test, TestingModule } from '@nestjs/testing';
import { FrontendUrlController } from './frontend-url.controller';
import { FrontendUrlService } from './frontend-url.service';

describe('FrontendUrlController', () => {
  let controller: FrontendUrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrontendUrlController],
      providers: [FrontendUrlService],
    }).compile();

    controller = module.get<FrontendUrlController>(FrontendUrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
