import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Render } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';

@Controller('profile')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    @Render('profile')
    getProfile() {
        return {};
    }

    //TODO сделать проверку (пользователь с такой почтой уже существует)
    @Get(':id')
    async getUser(@Param('id') id: number) {
        return this.userService.getUserById(id);
    }

    // @Get(':id')
    // async getUserByEmail(@Param('email') email: string) {
    //     return this.
    // }

    @Post('/add')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Patch(':id/edit')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUserById(id);
    }
}
