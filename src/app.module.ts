import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { TutorsModule } from './modules/tutors/tutors.module';
import { ReviewsModule } from './modules/review/reviews.module';
import { AuthModule } from './modules/auth/auth.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModuleGraphQL } from './graphql/users/users.module';
import { TutorsModuleGraphQL } from './graphql/tutors/tutors.module';
import { UsersModule } from './modules/users/users.module';
import { AssignmentsModuleGraphQL } from './graphql/assigments/assignments.module';
import { ReviewsModuleGraphQL } from './graphql/reviews/reviews.module';
import { ElapsedTimeInterceptor } from './common/interceptors/elapsed-time.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Request, Response } from 'express';
import { CacheControlInterceptor } from './common/interceptors/cache-control.interceptor';
import { EtagInterceptor } from './common/interceptors/etag.interceptor';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
            introspection: true,
            sortSchema: true,
            playground: true,
            context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
        }),
        TutorsModule,
        UsersModule,
        ReviewsModule,
        AuthModule,
        AssignmentsModule,
        UsersModuleGraphQL,
        TutorsModuleGraphQL,
        AssignmentsModuleGraphQL,
        ReviewsModuleGraphQL,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ElapsedTimeInterceptor,
        },
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheControlInterceptor,
        // },
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: EtagInterceptor,
        // },
    ],
})
export class AppModule {}
