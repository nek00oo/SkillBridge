import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { isValid, parse } from 'date-fns';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(private readonly prisma: PrismaService) {}

    //TODO сделать проверки на наличие объекта

    async createUser(createUserDto: CreateUserDto) {
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

    async getUserById(id: number) {
        return this.prisma.user.findUnique({
            where: { id: id },
        });
    }

    async getUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id: id },
            data: updateUserDto,
        });
    }

    async deleteUserById(id: number) {
        return this.prisma.user.delete({
            where: { id: id },
        });
    }
}
