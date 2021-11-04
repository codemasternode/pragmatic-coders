import { SkillEntity } from "app/entities/SkillEntity";

export interface SkillsStorage {
  getAll(): Promise<SkillEntity[]>;
  insert(data: Omit<SkillEntity, "skillId" | "updatedAt">): Promise<SkillEntity>;
  remove(skillId: number): Promise<number>;
  update(skillId: number, data: { name?: string, rate?: number }): Promise<SkillEntity | undefined>;
  getById(skillId: number): Promise<SkillEntity | undefined>
}
