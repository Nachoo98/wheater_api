import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  IsNull,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from './base.entity';
import { BaseRepository } from './base.repository';

/**
 * The BaseService is a generic class that provides CRUD operations for a given entity type.
 *
 * @template Entity - A TypeORM entity
 * @template R - A repository extending from BaseRepository
 */
export class BaseService<
  Entity extends BaseEntity,
  R extends BaseRepository<Entity>,
> {
  constructor(private readonly repository: R) {}

  /**
   * Fetches entities that match the provided filter.
   *
   * @param {FindManyOptions<Entity>} query - An optional object containing filter options.
   * @returns {Promise<Entity[]>} - A Promise that resolves to an array of entities.
   * @throws {EntityNotFound} - If no entity is found.
   * @example
   * // Fetch all users
   * const users = await userService.find();
   *
   * // Fetch users with name 'John Doe'
   * const users = await userService.find({ where: { name: 'John Doe' } });
   */
  async find(query?: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repository.find(query);
  }

  /**
   * Fetches a single entity matching the provided filter.
   *
   * @param {FindOneOptions<Entity>} query - An object containing filter options.
   * @returns {Promise<Entity>} - A Promise that resolves to an Entity if found.
   * @throws {EntityNotFound} - If no entity is found.
   * @example
   * // Fetch user with name 'John Doe'
   * const user = await userService.findOneOrFail({ where: { name: 'John Doe' } });
   */
  async findOneOrFail(query: FindOneOptions<Entity>): Promise<Entity> {
    return await this.repository.findOneOrFail(query);
  }

  /**
   * Fetches a single entity matching the provided ID.
   *
   * @param {number} id - The ID of the entity.
   * @returns {Promise<Entity>} - A Promise that resolves to an Entity if found.
   * @throws {EntityNotFound} - If no entity is found.
   * @example
   * // Fetch user with ID 1
   * const user = await userService.findOneByIdOrFail(1);
   */
  async findOneByIdOrFail(id: number): Promise<Entity> {
    return await this.findOneOrFail({ where: { id } } as FindOneOptions);
  }

  /**
   * Fetches a single entity matching the provided filter. Returns null if no entity is found.
   *
   * @param {FindOneOptions<Entity>} query - An object containing filter options.
   * @returns {Promise<Entity>} - A Promise that resolves to an Entity if found, null otherwise.
   * @example
   * // Fetch user with name 'John Doe'
   * const user = await userService.findOne({ where: { name: 'John Doe' } });
   */
  async findOne(query: FindOneOptions<Entity>): Promise<Entity> {
    return await this.repository.findOne(query);
  }

  /**
   * Creates a new entity in the database with the provided data.
   *
   * @param {Entity} data - The data for the new entity.
   * @returns {Promise<Entity>} - A Promise that resolves to the newly created entity.
   * @example
   * // Create a new user
   * const user = await userService.create({ name: 'John Doe', email: 'john@example.com' });
   */
  async create(data: Entity): Promise<Entity> {
    const { id } = await this.repository.create(data);
    return this.findOne({ where: { id } } as FindOneOptions<Entity>);
  }

  /**
   * Fetches a single entity matching the provided filter and updates it with the provided data.
   *
   * @param {FindOptionsWhere<Entity>} where - The conditions to find the entity.
   * @param {QueryDeepPartialEntity<Entity>} data - The data to update in the found entity.
   * @param {FindOptionsRelations<Entity>} relations - The relations to consider in the update operation.
   * @returns {Promise<Entity>} - A Promise that resolves to the updated entity.
   * @throws {EntityNotFound} - If no entity is found.
   * @example
   * // Update user with ID 1
   * const updatedUser = await userService.update({ id: 1 }, { name: 'Jane Doe' });
   */
  async update(
    where: FindOptionsWhere<Entity>,
    data: QueryDeepPartialEntity<Entity>,
    relations?: FindOptionsRelations<Entity>,
  ): Promise<Entity> {
    return await this.repository.updateOrFail(where, data, relations);
  }

  /**
   * Fetches a single entity matching the provided ID and updates it with the provided data.
   *
   * @param {number} id - The ID of the entity.
   * @param {QueryDeepPartialEntity<Entity>} data - The data to update in the found entity.
   * @param {FindOptionsRelations<Entity>} relations - The relations to consider in the update operation.
   * @returns {Promise<Entity>} - A Promise that resolves to the updated entity.
   * @throws {EntityNotFound} - If no entity is found.
   * @example
   * // Update user with ID 1
   * const updatedUser = await userService.updateById(1, { name: 'Jane Doe' });
   */
  async updateById(
    id: number,
    data: QueryDeepPartialEntity<Entity>,
    relations?: FindOptionsRelations<Entity>,
  ): Promise<Entity> {
    return await this.update(
      { id } as FindOptionsWhere<Entity>,
      data,
      relations,
    );
  }

  /**
   * Fetches a single entity matching the provided ID and performs a soft delete operation.
   *
   * @param {number} id - The ID of the entity.
   * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating the success of the operation.
   * @throws {EntityNotFound} - If no entity is found.
   * @example
   * // Soft delete user with ID 1
   * const isDeleted = await userService.deleteById(1);
   */
  async deleteById(id: number): Promise<boolean> {
    return await this.repository.deleteOrFail({
      id,
    } as FindOptionsWhere<Entity>);
  }

  /**
   * Fetches a single entity matching the provided ID and restores it by setting deletedAt to null.
   *
   * @param {number} id - The ID of the entity.
   * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating the success of the operation.
   * @throws {EntityNotFound} - If no entity is found.
   * @example
   * // Restore user with ID 1
   * const isRestored = await userService.restoreById(1);
   */
  async restoreById(id: number): Promise<boolean> {
    return await this.repository.restoreOrFail({
      id,
    } as FindOptionsWhere<Entity>);
  }

  /**
   * Returns the number of records according to the specified filter
   */
  async count(filter: object): Promise<number> {
    const total = await this.repository.find({ where: filter });
    return total.length;
  }
}
