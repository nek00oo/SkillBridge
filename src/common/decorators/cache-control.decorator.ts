import { SetMetadata } from '@nestjs/common';

export const CACHE_CONTROL_METADATA_KEY = 'cache-control';

export const CacheControl = (visibility: 'public' | 'private' = 'private', maxAge = 3600) => {
    return SetMetadata(CACHE_CONTROL_METADATA_KEY, `${visibility}, max-age=${maxAge}`);
};
