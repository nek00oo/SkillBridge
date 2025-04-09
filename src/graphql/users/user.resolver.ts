import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlUser } from './entities/user.entity';
import { UsersService } from '../../modules/users/users.service';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => GqlUser)
export class UserResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => GqlUser)
    async user(@Args('id') id: number) {
        return this.usersService.getUserById(id);
    }

    @Query(() => GqlUser)
    async userByEmail(@Args('email') email: string) {
        return this.usersService.findUserByEmail(email);
    }

    @Query(() => [GqlUser])
    async users(
        @Args('limit', { defaultValue: 10 }) limit: number,
        @Args('offset', { defaultValue: 0 }) offset: number,
    ) {
        return this.usersService.getUsers(limit, offset);
    }

    @Mutation(() => GqlUser)
    async createUser(@Args('input') input: CreateUserInput) {
        return this.usersService.createUser(input);
    }

    @Mutation(() => GqlUser)
    async updateUser(@Args('id') id: number, @Args('input') input: UpdateUserInput) {
        return this.usersService.updateUser(id, input);
    }

    @Mutation(() => GqlUser)
    async deleteUser(@Args('id') id: number) {
        return this.usersService.deleteUserById(id);
    }
}
