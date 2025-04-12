import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from './entities/user.entity';
import { UsersService } from '../../modules/users/users.service';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { CacheControl } from '../../common/decorators/cache-control.decorator';

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(private readonly usersService: UsersService) {}

    @Mutation(() => UserEntity)
    async createUser(@Args('input') input: CreateUserInput) {
        return this.usersService.createUser(input);
    }

    @Query(() => UserEntity)
    @CacheControl('private', 3600)
    async getUserById(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.getUserById(id);
    }

    @Query(() => UserEntity)
    async getUserByEmail(@Args('email') email: string) {
        return this.usersService.findUserByEmail(email);
    }

    @Query(() => [UserEntity])
    async getUsers(
        @Args('limit', { defaultValue: 10 }) limit: number,
        @Args('offset', { defaultValue: 0 }) offset: number,
    ) {
        return this.usersService.getUsers(limit, offset);
    }

    @Mutation(() => UserEntity)
    async updateUserById(@Args('id', { type: () => Int }) id: number, @Args('input') input: UpdateUserInput) {
        return this.usersService.updateUser(id, input);
    }

    @Mutation(() => UserEntity)
    async deleteUserById(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.deleteUserById(id);
    }
}
