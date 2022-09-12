import { parse, UserAgent } from './parse';

export const useUserAgent = (ua: string): UserAgent => parse(ua);
