import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Get,
    Delete,
    Param,
    Res,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './image-storage.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('files')
export class ImageStorageController {
    constructor(private readonly s3Service: S3Service) {}

    @UseInterceptors(
        FileInterceptor('file', {
            storage: undefined,
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/^image\/(jpeg|png)$/)) {
                    cb(new BadRequestException('Unsupported file type'), false);
                } else {
                    cb(null, true);
                }
            },
        }),
    )
    @UseGuards(JwtAuthGuard)
    @Post('upload')
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        const fileUrl = await this.s3Service.uploadFile(file.buffer, file.originalname, file.mimetype);
        return { url: fileUrl };
    }

    @UseGuards(JwtAuthGuard)
    @Get(':key')
    async getFile(@Param('key') key: string, @Res() res: Response) {
        const signedUrl = await this.s3Service.getSignedUrl(key);
        console.log(signedUrl);
        return res.redirect(signedUrl);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':key')
    async deleteFile(@Param('key') key: string) {
        await this.s3Service.deleteFile(key);
        return { message: 'File deleted successfully' };
    }
}
