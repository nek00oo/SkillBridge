import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        const endpoint = this.configService.get<string>('S3_ENDPOINT');
        const region = this.configService.get<string>('S3_REGION');
        this.bucketName = this.configService.get<string>('S3_BUCKET')!;
        const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('S3_SECRET_ACCESS_KEY');

        if (!region || !endpoint || !accessKeyId || !secretAccessKey) {
            throw new Error('Missing S3 configuration in .env');
        }

        this.s3Client = new S3Client({
            region,
            endpoint,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    async uploadFile(buffer: Buffer, key: string, mimetype: string): Promise<string> {
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: buffer,
                ContentType: mimetype,
            }),
        );

        return `${this.configService.get('S3_ENDPOINT')}/${this.bucketName}/${key}`;
    }

    async deleteFile(key: string): Promise<void> {
        await this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            }),
        );
    }

    async getSignedUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    }
}
