import { randomUUID } from 'node:crypto';

export function generateUniqueEmail(prefix = 'qa-signup'): string {
  return `${prefix}-${Date.now()}-${randomUUID().slice(0, 8)}@mailinator.com`;
}
