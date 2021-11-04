import { Knex } from "knex";
import { SkillEntity, skillEntitySchema } from "app/entities/SkillEntity";
import { Table } from "app/storages/DbSchema";
import { z } from "zod";
import { SkillsStorage } from "app/storages/SkillsStorage";

export class SkillsDbStorage implements SkillsStorage {
  constructor(private readonly database: Knex) { }

  async getAll(): Promise<SkillEntity[]> {
    const result = await this.database(Table.Skills).select("*");

    return z.array(skillEntitySchema).parse(result);
  }

  async update(skillId: number, data: { name?: string | undefined; rate?: number | undefined; }): Promise<SkillEntity | undefined> {
    const skills: SkillEntity[] = await this.database(Table.Skills)
      .where("skillId", skillId)
      .update({ ...data, updatedAt: new Date() })
      .returning("*")
    const skill = skills[0]

    return skill
  }

  async getById(skillId: number): Promise<SkillEntity> {
    const skill = await this.database(Table.Skills)
      .where("skillId", skillId)
      .first()

    return skill
  }

  async remove(skillId: number): Promise<number> {
    const numberOfDeletedRows = await this.database(Table.Skills).where("skillId", skillId).del();

    return numberOfDeletedRows;
  }

  async insert(data: Omit<SkillEntity, "skillId" | "updatedAt">): Promise<SkillEntity> {
    const [result] = await this.database(Table.Skills)
      .insert({
        name: data.name,
        rate: data.rate,
      })
      .returning("*");

    return skillEntitySchema.parse(result);
  }
}
