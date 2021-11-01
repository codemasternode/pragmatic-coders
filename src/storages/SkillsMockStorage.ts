import { SkillEntity } from "app/entities/SkillEntity";
import { SkillsStorage } from "app/storages/SkillsStorage";

export class SkillsMockStorage implements SkillsStorage {
  private skills: SkillEntity[] = [];

  async getAll(): Promise<SkillEntity[]> {
    return this.skills;
  }

  async remove(skillId: number): Promise<number> {
    const foundIndex = this.skills.findIndex((skill) => skill.skillId === skillId)

    if (foundIndex === -1) {
      return 0
    }

    this.skills = this.skills.filter((skill) => skill.skillId !== skillId)

    return 1
  }

  async insert(data: Omit<SkillEntity, "skillId" | "updatedAt">): Promise<SkillEntity> {
    const skillEntity = {
      skillId: parseInt(this.skills.length + "" + Date.now()),
      name: data.name,
      rate: data.rate,
      updatedAt: new Date(),
    };
    this.skills.push(skillEntity);
    return skillEntity;
  }
}
