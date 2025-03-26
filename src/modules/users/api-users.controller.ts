import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    Req,
    UseFilters,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';
import { UnauthorizedRedirectFilter } from '../auth/filters/unauthorized-redirect.filter';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('api/v1/users')
export class ApiUsersController {
    constructor(private readonly userService: UsersService) {}

    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User successfully created.' })
    @ApiResponse({ status: 400, description: 'Invalid data provided.' })
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User found.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUserById(id);
    }

    // TODO: Argument `id`: Invalid value provided. Expected Int, provided Object.
    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'User successfully updated.' })
    @ApiResponse({ status: 400, description: 'Invalid data provided.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Patch(':id')
    async updateUserById(@Param('id', ParseIntPipe) userId: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(userId, updateUserDto);
    }

    @ApiOperation({ summary: 'Update the current authenticated user' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'User successfully updated.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Patch()
    @UseGuards(JwtAuthGuard)
    @UseFilters(UnauthorizedRedirectFilter)
    async updateUser(@Req() req: RequestWithUser, @Body() updateUserDto: UpdateUserDto) {
        const userId = req.user.id;
        return this.userService.updateUser(userId, updateUserDto);
    }

    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User successfully deleted.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUserById(id);
    }
}
