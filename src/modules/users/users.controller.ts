import { Controller, Get, Render, Req, UseFilters, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/interfaces/requestWithUser';
import { UnauthorizedRedirectFilter } from '../auth/filters/unauthorized-redirect.filter';
import { AssignmentsService } from '../assignments/assignments.service';

@Controller('profile')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
        private readonly assignmentsService: AssignmentsService,
    ) {}

    @UseFilters(UnauthorizedRedirectFilter)
    @UseGuards(JwtAuthGuard)
    @Get()
    @Render('profile')
    async getProfile(@Req() req: RequestWithUser) {
        const user = await this.userService.getUserById(req.user.id);
        const assignments = await this.assignmentsService.getAssignmentsByStudentId(req.user.id);
        return {
            title: 'Профиль',
            styles: ['profile', 'header', 'iziToast.min'],
            scripts: ['profile', 'header', 'iziToast.min'],
            mainClass: 'profile-section',
            header: 'header',
            user,
            assignments: assignments,
        };
    }
}
