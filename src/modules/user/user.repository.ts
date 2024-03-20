import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './entity/user.entity';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(manager: EntityManager) {
    super(manager, User);
  }
}
