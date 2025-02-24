import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    app.useStaticAssets(join(__dirname, '..', 'public'));

    const port = configService.get<number>('PORT') || 3000;
    await app.listen(port);
}

bootstrap();
