import * as fs from 'fs';

export function urlValidation(url: string): boolean {
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function saveDataToJsonFile(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
export function readDataFromJsonFile<T>(filePath: string): T {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent) as T;
}
