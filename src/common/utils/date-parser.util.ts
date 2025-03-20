import { BadRequestException } from '@nestjs/common';
import { parse, isValid } from 'date-fns';

export function parseDate(dateString: string, format: string): Date {
    const parsedDate = parse(dateString, format, new Date());
    if (!isValid(parsedDate)) {
        throw new BadRequestException(`Invalid date format. Expected format: ${format}`);
    }
    return parsedDate;
}
