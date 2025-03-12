import { BadRequestException } from '@nestjs/common';
import { parse, isValid } from 'date-fns';

export function parseDateOrNull(dateString: string | undefined, format: string): Date | null {
    if (!dateString) return null;
    const parsedDate = parse(dateString, format, new Date());
    if (!isValid(parsedDate)) {
        throw new BadRequestException(`Invalid date format. Expected format: ${format}`);
    }
    return parsedDate;
}