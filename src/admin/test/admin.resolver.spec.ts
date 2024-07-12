import { Test, TestingModule } from '@nestjs/testing';
import { UsersRe } from '../users/users.resolver';
import { UsersService } from '../users/users.service';

describe('AdminResolver', () => {
  let resolver: UsersRe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersRe, UsersService],
    }).compile();

    resolver = module.get<UsersRe>(UsersRe);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
