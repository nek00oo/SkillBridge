import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { GqlUser } from './entities/graphql.entity';
import { UsersService } from '../modules/users/users.service';

@Resolver(() => GqlUser)
export class UserResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => GqlUser)
    async user(@Args('id', { type: () => ID }) id: number) {
        return this.usersService.getUserById(id);
    }

    @Query(() => [GqlUser])
    async users(
        @Args('limit', { defaultValue: 10 }) limit: number,
        @Args('offset', { defaultValue: 0 }) offset: number,
    ) {
        return this.usersService.getUsers(limit, offset);
    }
}
