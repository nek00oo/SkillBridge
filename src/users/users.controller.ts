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

    //@UseGuards(JwtAuthGuard)
    @Get()
    @Render('profile')
    getProfile(@Req() req: RequestWithUser) {
        // const userId = req.user.id;
        const userId = 16;
        return this.userService.getUserById(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('get-user')
    async getUserByJwt(@Req() req: RequestWithUser) {
        const userId = req.user.id;
        console.log('UserId:', userId);
        return this.userService.getUserById(userId);
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
