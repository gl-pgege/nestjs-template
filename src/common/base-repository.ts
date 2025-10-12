export abstract class BaseRepository<T, CreateData, UpdateData> {
  abstract create(data: CreateData): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract findMany(params?: any): Promise<T[]>;
  abstract update(id: string, data: UpdateData): Promise<T>;
  abstract delete(id: string): Promise<T>;
}
