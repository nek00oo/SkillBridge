import { Module } from '@nestjs/common';
import { UserResolver } from './graphql.resolver';
import { UsersModule } from '../modules/users/users.module';

@Module({
    imports: [UsersModule],
    providers: [UserResolver],
})
export class GraphqlModule {}
