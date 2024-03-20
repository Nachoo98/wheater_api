import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller()
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getUser(): string {
    return this.userService.getUser();
  }
}
