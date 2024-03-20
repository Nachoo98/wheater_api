import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VersionService } from './version.service';

@Controller()
@ApiTags('Version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}
  @Get()
  getVersion(): string {
    return this.versionService.getDate();
  }
}
