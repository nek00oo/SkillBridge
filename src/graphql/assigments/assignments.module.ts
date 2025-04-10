import { Module } from '@nestjs/common';
import { AssignmentsResolver } from './assignments.resolver';
import { AssignmentsModule } from '../../modules/assignments/assignments.module';

@Module({
    imports: [AssignmentsModule],
    providers: [AssignmentsResolver],
})
export class AssignmentsModuleGraphQL {}
