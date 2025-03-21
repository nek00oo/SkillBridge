import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma.service';
import { ApiUsersController } from './api-users.controller';

@Module({
    controllers: [UsersController, ApiUsersController],
    providers: [UsersService, PrismaService],
    exports: [UsersService],
})
export class UsersModule {}
