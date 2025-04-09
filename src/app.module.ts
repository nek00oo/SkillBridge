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
import { UserResolver } from './graphql/users/user.resolver';
import { TutorsModuleGraphQL } from './graphql/tutors/tutors.module';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
            introspection: true,
            sortSchema: true,
            playground: true,
        }),
        TutorsModule,
        UsersModule,
        ReviewsModule,
        AuthModule,
        AssignmentsModule,
        UsersModuleGraphQL,
        TutorsModuleGraphQL,
    ],
    controllers: [AppController],
    providers: [UserResolver],
})
export class AppModule {}
