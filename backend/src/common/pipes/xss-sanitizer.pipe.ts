import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class XssSanitizerPipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    if (typeof value === 'object' && value !== null) {
      return this.sanitizeObject(value as Record<string, unknown> | unknown[]);
    }

    return value;
  }

  private sanitizeString(str: string): string {
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/&/g, '&amp;');
  }

  private sanitizeObject(
    obj: Record<string, unknown> | unknown[],
  ): Record<string, unknown> | unknown[] {
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        if (typeof item === 'string') {
          return this.sanitizeString(item);
        } else if (typeof item === 'object' && item !== null) {
          return this.sanitizeObject(item as Record<string, unknown>);
        }
        return item;
      });
    }

    const sanitized: Record<string, unknown> = {};
    const objRecord = obj;

    for (const key in objRecord) {
      if (Object.prototype.hasOwnProperty.call(objRecord, key)) {
        const value = objRecord[key];

        if (typeof value === 'string') {
          sanitized[key] = this.sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = this.sanitizeObject(
            value as Record<string, unknown> | unknown[],
          );
        } else {
          sanitized[key] = value;
        }
      }
    }

    return sanitized;
  }
}
