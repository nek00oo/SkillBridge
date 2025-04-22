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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    app.useStaticAssets(join(process.cwd(), 'public'), {
        prefix: '/',
    });
    app.setBaseViewsDir(join(process.cwd(), 'views'));
    app.setViewEngine('hbs');

    hbs.registerPartials(join(process.cwd(), 'views', 'partials'));

    console.log('Views dir:', join(process.cwd(), 'views'));
    console.log('Partials dir:', join(process.cwd(), 'views', 'partials'));

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
        }),
    );

    app.useGlobalFilters(new PrismaExceptionFilter(), new AllExceptionFilter());

    app.use(cookieParser());

    const config = new DocumentBuilder()
        .setTitle('SkillBridge')
        .setDescription('The SkillBridge API description')
        .setVersion('1.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, documentFactory);

    const port = configService.get<number>('PORT', 3000);
    await app.listen(port, () => {
        console.log('App start at port: ', port);
    });
}

bootstrap();
