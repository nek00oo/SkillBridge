import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { RequestWithCookies } from './auth/interfaces/requestWithCookies';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');

    hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

    app.set('view options', {
        extension: 'hbs',
        map: { html: 'hbs' },
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            skipMissingProperties: true,
        }),
    );

    app.use(cookieParser());

    // app.enableCors({
    //     origin: 'http://localhost:8080',
    //     credentials: true,
    //     exposedHeaders: ['Set-Cookie'],
    //     allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    // });

    app.use((req: RequestWithCookies, res, next) => {
        console.log('Cookies:', req.headers.cookie);
        console.log('Origin:', req.headers.origin);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        next();
    });

    const port = configService.get<number>('PORT', 3000);
    await app.listen(port, () => {
        console.log('App start at port: ', port);
    });
}

bootstrap();
