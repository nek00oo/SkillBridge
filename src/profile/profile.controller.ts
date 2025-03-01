import { Controller, Get, Render } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    @Render('profile')
    getProfile() {
        return {};
    }
}
