import { Role } from '@prisma/client';

export interface UserInterface {
    id: number;
    email: string;
    role: Role;
}
