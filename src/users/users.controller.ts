import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Render,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';

@Controller('profile')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    //TODO сделать проверку (пользователь с такой почтой уже существует)
    @Post('/add')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @Render('profile')
    async getProfile(@Req() req: RequestWithUser) {
        const userId = req.user.id;
        const user = await this.userService.getUserById(userId);
        return {
            title: 'Профиль',
            styles: ['profile', 'header'],
            scripts: ['profile', 'header'],
            mainClass: 'profile-section',
            header: 'header',
            user,
        };
    }

    @Get(':id')
    async getUser(@Param('id') id: number) {
        return this.userService.getUserById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/edit')
    async updateUser(@Req() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
        const userId = req.user.id;
        return this.userService.updateUser(userId, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUserById(id);
    }
}
