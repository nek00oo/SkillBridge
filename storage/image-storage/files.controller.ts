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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './image-storage.service';
import { Response } from 'express';

@Controller('files')
export class FilesController {
    constructor(private readonly s3Service: S3Service) {}

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            // Используем in-memory storage, чтобы работать с file.buffer
            storage: undefined,
            limits: {
                fileSize: 5 * 1024 * 1024, // Ограничение: 5 MB
            },
            fileFilter: (req, file, cb) => {
                // Разрешаем только JPEG, PNG и GIF (пример)
                if (!file.mimetype.match(/^image\/(jpeg|png|gif)$/)) {
                    cb(new BadRequestException('Unsupported file type'), false);
                } else {
                    cb(null, true);
                }
            },
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        const fileUrl = await this.s3Service.uploadFile(file.buffer, file.originalname, file.mimetype);
        return { url: fileUrl };
    }

    @Get(':key')
    async getFile(@Param('key') key: string, @Res() res: Response) {
        const signedUrl = await this.s3Service.getSignedUrl(key);
        return res.redirect(signedUrl);
    }

    @Delete(':key')
    async deleteFile(@Param('key') key: string) {
        await this.s3Service.deleteFile(key);
        return { message: 'File deleted successfully' };
    }
}
