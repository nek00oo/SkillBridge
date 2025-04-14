import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    Req,
    UseFilters,
    ClassSerializerInterceptor,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';
import { UnauthorizedRedirectFilter } from '../auth/filters/unauthorized-redirect.filter';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { CacheControl } from '../../common/decorators/cache-control.decorator';
import { RolesGuard } from '../../common/duards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('api/v1/users')
export class ApiUsersController {
    constructor(private readonly userService: UsersService) {}

    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User successfully created.', type: UserResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid data provided.' })
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return new UserResponseDto(await this.userService.createUser(createUserDto));
    }

    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({
        status: 200,
        description: 'User found.',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @CacheControl('public', 36000)
    @Get(':id')
    async getUserById(@Param('id') id: number): Promise<UserResponseDto> {
        return new UserResponseDto(await this.userService.getUserById(id));
    }

    @ApiOperation({ summary: 'Update a user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'User successfully updated.', type: UserResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid data provided.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    async updateUserById(@Param('id') userId: number, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        return new UserResponseDto(await this.userService.updateUser(userId, updateUserDto));
    }

    @ApiOperation({ summary: 'Update the current authenticated user' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'User successfully updated.', type: UserResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.STUDENT, Role.TUTOR)
    @UseFilters(UnauthorizedRedirectFilter)
    @Patch()
    async updateUserByAuthId(
        @Req() req: RequestWithUser,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        const userId = req.user.id;
        return new UserResponseDto(await this.userService.updateUser(userId, updateUserDto));
    }

    @ApiOperation({ summary: 'Delete a user by ID' })
    @ApiParam({ name: 'id', type: Number, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User successfully deleted.', type: UserResponseDto })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    async deleteUserById(@Param('id') id: number): Promise<UserResponseDto> {
        return new UserResponseDto(await this.userService.deleteUserById(id));
    }
}
