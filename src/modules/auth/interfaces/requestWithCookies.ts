import { Request } from 'express';

export interface RequestWithCookies extends Request {
    cookies: { authToken: string };
}
