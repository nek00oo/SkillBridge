import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Render } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    @Render('profile')
    getProfile() {
        return {};
    }

    //TODO сделать проверку (пользователь с такой почтой уже существует)
    @Get(':id')
    async getUser(@Param('id') id: number) {
        return this.profileService.getUserById(id);
    }

    @Post('/add')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.profileService.createUser(createUserDto);
    }

    @Patch(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.profileService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.profileService.deleteUserById(id);
    }
}
