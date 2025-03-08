import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { parse } from 'date-fns';

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService) {}

    //TODO сделать проверки на наличие объекта

    async createUser(createUserDto: CreateUserDto) {
        const { birthDate, ...userData } = createUserDto;

        const parsedDate = parse(birthDate, 'dd-MM-yyyy', new Date());
        if (isNaN(parsedDate.getTime())) {
            throw new BadRequestException('Invalid date format. Expected format: DD-MM-YYYY');
        }

        return this.prisma.user.create({
            data: {
                ...userData,
                birthDate: parsedDate.toISOString(),
            },
        });
    }

    async getUserById(id: number) {
        return this.prisma.user.findUnique({
            where: { id: id },
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
