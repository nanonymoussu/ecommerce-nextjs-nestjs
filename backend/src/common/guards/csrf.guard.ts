import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as crypto from 'crypto';

export const SKIP_CSRF_KEY = 'skipCsrf';
export const SkipCsrf = () => Reflect.metadata(SKIP_CSRF_KEY, true);

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skipCsrf = this.reflector.getAllAndOverride<boolean>(SKIP_CSRF_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipCsrf) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const method = request.method;

    // Skip CSRF for GET, HEAD, OPTIONS requests
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = request.headers?.['x-csrf-token'] || request.body?._token;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const sessionToken = request.session?.csrfToken;

    if (!token || !sessionToken) {
      throw new ForbiddenException('CSRF token missing');
    }

    // Use timing-safe comparison to prevent timing attacks
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (!this.timingSafeEqual(token, sessionToken)) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }

  private timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  static generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
