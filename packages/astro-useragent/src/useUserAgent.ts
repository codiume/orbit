import { parse, type UserAgent } from './parse';

export const useUserAgent = (ua: string | null): UserAgent => parse(ua);
