import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseEntity } from './base.entity';
import { EntityNotFound } from 'src/common/exceptions/exceptions';

/**
 * BaseRepository is a generic class for managing operations in a repository.
 * @template Entity - Type of the entity which extends BaseEntity
 */
export class BaseRepository<Entity extends BaseEntity> {
  /**
   * @type {EntityManager} - TypeORM's EntityManager instance
   */
  protected manager: EntityManager;

  /**
   * @type {new () => Entity} - Entity class
   */
  protected entityClass: new () => Entity;

  /**
   * @type {string} - Entity's name
   */
  private readonly entity: string;

  /**
   * @param {EntityManager} manager - TypeORM's EntityManager
   * @param {new () => Entity} entityClass - Entity class
   */
  constructor(manager: EntityManager, entityClass: new () => Entity) {
    this.manager = manager;
    this.entityClass = entityClass;
    this.entity = this.manager.getRepository(entityClass).metadata.name;
  }

  /**
   * @returns {string} - Entity's name
   */
  private get entityName(): string {
    return this.entity;
  }

  /**
   * Creates an entity with the given data.
   * @param {Entity} data - Entity data
   * @returns {Promise<Entity>} - Promise of the created entity
   */
  async create(data: Entity): Promise<Entity> {
    return await this.manager.save(this.entityClass, data);
  }

  /**
   * Finds an entity by the given filter.
   * If the entity exists, it returns the entity.
   * If the entity does not exist, it creates a new entity with the given data.
   * @param {FindOneOptions<Entity>} where - Filter to find entity
   * @param {Entity} data - Entity data for creating a new entity if not found
   * @returns {Promise<Entity>} - Promise of the found or created entity
   */
  async findOrCreate(
    where: FindOneOptions<Entity>,
    data: Entity,
  ): Promise<Entity> {
    const entity = this.findOne(where);
    if (entity) return entity;
    if (!entity) {
      return this.create(data);
    }
  }

  /**
   * Finds entities based on the provided filter.
   * If it does not find any results, it returns an empty array.
   * @param {FindManyOptions<Entity>} options - Filter options for finding entities
   * @returns {Promise<Entity[]>} - Promise of the found entities
   */
  async find(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return await this.manager.find(this.entityClass, options);
  }

  /**
   * Finds a single entity based on the provided filter.
   * If it does not find any results, it returns null.
   * @param {FindOneOptions<Entity>} filter - Filter to find an entity
   * @returns {Promise<Entity | null>} - Promise of the found entity
   */
  async findOne(filter: FindOneOptions<Entity>): Promise<Entity | null> {
    return await this.manager.findOne(this.entityClass, filter);
  }

  /**
   * Finds a single entity based on the provided filter.
   * If it does not find any results, it throws EntityNotFound error.
   * @param {FindOneOptions<Entity>} filter - Filter to find an entity
   * @returns {Promise<Entity>} - Promise of the found entity
   * @throws {EntityNotFound} - If the entity is not found
   */
  async findOneOrFail(filter: FindOneOptions<Entity>): Promise<Entity> {
    const entity = await this.findOne(filter);
    this.checkEntityExist(entity);
    return entity;
  }

  /**
   * Updates an entity based on the provided filter.
   * If it finds the entity, it updates it with the provided data.
   * @param {FindOptionsWhere<Entity>} where - Filter to find an entity
   * @param {QueryDeepPartialEntity<Entity>} data - Data to update the entity
   * @param {FindOptionsRelations<Entity>} relations - Relations for the entity
   * @returns {Promise<Entity>} - Promise of the updated entity
   */
  async update(
    where: FindOptionsWhere<Entity>,
    data: QueryDeepPartialEntity<Entity>,
    relations?: FindOptionsRelations<Entity>,
  ): Promise<Entity> {
    await this.manager.update(this.entityClass, where, data);
    return await this.manager.findOne(this.entityClass, { where, relations });
  }

  /**
   * Updates an entity based on the provided filter.
   * If it does not find any results, it throws EntityNotFound error.
   * @param {FindOptionsWhere<Entity>} where - Filter to find an entity
   * @param {QueryDeepPartialEntity<Entity>} data - Data to update the entity
   * @param {FindOptionsRelations<Entity>} relations - Relations for the entity
   * @returns {Promise<Entity>} - Promise of the updated entity
   * @throws {EntityNotFound} - If the entity is not found
   */
  async updateOrFail(
    where: FindOptionsWhere<Entity>,
    data: QueryDeepPartialEntity<Entity>,
    relations?: FindOptionsRelations<Entity>,
  ): Promise<Entity> {
    const updated = await this.update(where, data, relations);
    this.checkEntityExist(updated);
    return updated;
  }

  /**
   * Soft deletes an entity based on the provided filter.
   * If it finds the entity, it sets its deletedAt to new Date().
   * @param {FindOptionsWhere<Entity>} where - Filter to find an entity
   * @returns {Promise<UpdateResult>} - Promise of the soft delete result
   */
  async softDelete(where: FindOptionsWhere<Entity>): Promise<UpdateResult> {
    return await this.manager.softDelete(this.entityClass, where);
  }

  /**
   * Soft deletes an entity based on the provided filter.
   * If it does not find any results, it throws EntityNotFound error.
   * @param {FindOptionsWhere<Entity>} where - Filter to find an entity
   * @returns {Promise<boolean>} - Returns true if soft deletion is successful
   * @throws {EntityNotFound} - If the entity is not found
   */
  async deleteOrFail(where: FindOptionsWhere<Entity>): Promise<boolean> {
    const { affected } = await this.softDelete(where);
    this.checkEntityExist(affected);
    return true;
  }

  /**
   * Restores an entity based on the provided filter.
   * If it finds the entity, it sets its deletedAt to null.
   * @param {FindOptionsWhere<Entity>} where - Filter to find an entity
   * @returns {Promise<UpdateResult>} - Promise of the restore result
   */
  async restore(where: FindOptionsWhere<Entity>): Promise<UpdateResult> {
    return await this.manager.restore(this.entityClass, where);
  }

  /**
   * Restores an entity based on the provided filter.
   * If it does not find any results, it throws EntityNotFound error.
   * @param {FindOptionsWhere<Entity>} where - Filter to find an entity
   * @returns {Promise<boolean>} - Returns true if restoration is successful
   * @throws {EntityNotFound} - If the entity is not found
   */
  async restoreOrFail(where: FindOptionsWhere<Entity>): Promise<boolean> {
    const { affected } = await this.restore(where);
    this.checkEntityExist(affected);
    return true;
  }

  private checkEntityExist(data: number | null | Entity): void {
    if (data === 0 || data === null) throw new EntityNotFound(this.entityName);
  }
}
