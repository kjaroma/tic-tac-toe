import { IBaseRepository } from './interfaces/IBaseRepository';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(protected readonly model: any) {}

  async create(data: T): Promise<T> {
    return await this.model.create({ data });
  }

  async findUnique(queryOption: Record<string, unknown>): Promise<T> {
    return await this.model.findUnique({ where: queryOption });
  }

  async update(
    queryOption: Record<string, unknown>,
    data: Partial<T>,
  ): Promise<T> {
    return await this.model.update({
      where: queryOption,
      data,
    });
  }
}
