import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma.service';
import { ApiUsersController } from './api-users.controller';
import { AssignmentsModule } from '../assignments/assignments.module';

@Module({
    controllers: [UsersController, ApiUsersController],
    providers: [UsersService, PrismaService],
    exports: [UsersService],
    imports: [AssignmentsModule],
})
export class UsersModule {}
