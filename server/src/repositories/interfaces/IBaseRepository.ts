import { IBaseRepository } from './IBaseRepository';
export interface IBaseRepository<T> {
  create(item: T): Promise<T>;
  findUnique(queryOption: Record<string, unknown>): Promise<T | null>;
}
