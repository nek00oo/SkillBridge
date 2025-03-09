import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { isValid, parse } from 'date-fns';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    //TODO сделать проверки на наличие объекта

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { birthDate, ...userData } = createUserDto;

        let parsedBirthDate: Date | null = null;
        if (birthDate) {
            parsedBirthDate = parse(birthDate, 'dd-MM-yyyy', new Date());
            if (!isValid(parsedBirthDate)) {
                throw new BadRequestException('Invalid date format. Expected format: DD-MM-YYYY');
            }
        }

        return this.prisma.user.create({
            data: {
                ...userData,
                birthDate: parsedBirthDate?.toISOString() || null,
            },
        });
    }

    async getUserById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id: id },
        });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        return this.prisma.user.update({
            where: { id: id },
            data: updateUserDto,
        });
    }

    async deleteUserById(id: number): Promise<User> {
        return this.prisma.user.delete({
            where: { id: id },
        });
    }
}
