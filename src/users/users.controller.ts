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
    getProfile(@Req() req: RequestWithUser) {
        const userId = req.user.id;
        return this.userService.getUserById(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('get-user')
    async getUserByJwt(@Req() req: RequestWithUser) {
        const userId = req.user.id;
        return this.userService.getUserById(userId);
    }

    @Get(':id')
    async getUser(@Param('id') id: number) {
        return this.userService.getUserById(id);
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
