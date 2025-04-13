import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './image-storage.service';
import { ImageStorageController } from './image-storage.controller';

@Module({
    controllers: [ImageStorageController],
    providers: [S3Service],
    imports: [ConfigModule],
    exports: [S3Service],
})
export class S3Module {}
