import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './common/filters/exception.filter';
import { NextFunction, Request } from 'express';
import { IResponseWithLayout } from './common/interfaces/IResponseWithLayout';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    app.useStaticAssets(join(__dirname, '..', 'public'), {
        prefix: '/',
    });
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('hbs');

    hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

    hbs.registerHelper('percent', (completed, total) => {
        return ((completed / total) * 100).toFixed(2);
    });

    hbs.registerHelper('eq', (a, b) => a === b);

    app.use((req: Request, res: IResponseWithLayout, next: NextFunction) => {
        res.locals.layout = 'layouts/layout';
        next();
    });

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

    app.useGlobalFilters(new AllExceptionFilter(), new PrismaExceptionFilter());

    app.use(cookieParser());

    const port = configService.get<number>('PORT', 3000);
    await app.listen(port, () => {
        console.log('App start at port: ', port);
    });
}

bootstrap();
