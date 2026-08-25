import { randomInt } from 'node:crypto';

export function generateUniquePhone(): string {
  const areaCodes = ['416', '647', '437', '613', '819', '236'];
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
  const exchange = String(randomInt(200, 900));
  const lineNumber = String(randomInt(1000, 10000));
  return `${areaCode}${exchange}${lineNumber}`;
}
