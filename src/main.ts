import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');

    hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

    app.set('view options', { extension: 'hbs' });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            skipMissingProperties: true,
        }),
    );

    const port = configService.get<number>('PORT', 3000);
    await app.listen(port, () => {
        console.log('App start at port: ', port);
    });
}

bootstrap();
