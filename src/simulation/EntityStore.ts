import type { Entity } from './Entity';

export class EntityStore {
  private readonly entitiesById = new Map<number, Entity>();

  get entities() {
    return Array.from(this.entitiesById.values());
  }

  get size() {
    return this.entitiesById.size;
  }

  get(id: number) {
    return this.entitiesById.get(id);
  }

  add(entity: Entity) {
    this.entitiesById.set(entity.id, entity);
  }

  delete(id: number) {
    this.entitiesById.delete(id);
  }

  clear() {
    this.entitiesById.clear();
  }
}
