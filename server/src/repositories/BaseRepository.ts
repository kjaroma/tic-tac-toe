import { IBaseRepository } from "./interfaces/IBaseRepository";

export abstract class BaseRepository<T> implements IBaseRepository<T> {

    constructor(protected readonly model: any){}

    async create(item: T): Promise<T> {
        return await this.model.create({data: item})
    }

    async findUnique(queryOption: Record<string, unknown>): Promise<T> {
        return await this.model.findUnique({where: queryOption})
    }
}