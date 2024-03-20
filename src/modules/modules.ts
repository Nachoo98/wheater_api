import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { VersionModule } from './version/version.module';
import { UserModule } from './user/user.module';

const routes: Routes = [
  {
    path: 'version',
    module: VersionModule,
  },
  {
    path: 'user',
    module: UserModule,
  },
];

@Module({
  imports: [RouterModule.register(routes), VersionModule, UserModule],
})
export class Modules {}
