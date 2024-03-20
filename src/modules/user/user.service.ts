import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { User } from './entity/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  getUser(): string {
    return 'user';
  }
}
