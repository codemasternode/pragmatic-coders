import chai, { expect } from "chai";
import { getTestApp, TestApp } from "app/setup-integration-tests.test";
import { SkillDto } from "../dtos/SkillDto";

describe("createSkillController", () => {
  let testApp: TestApp;
  let agent: ChaiHttp.Agent;

  beforeEach(async () => {
    testApp = await getTestApp();
    agent = chai.request.agent(testApp.app);
  });

  it("should create skill when skill rate is valid", async () => {
    const requstBodySkill = {
      name: "New Test Skill",
      rate: 5,
    };
    const response = await agent.post("/skills").send(requstBodySkill);
    expect(response.status).to.equal(200);

    const skillFromResponse = response.body as SkillDto;

    expect(skillFromResponse.skillId).to.be.an("number");
    expect(skillFromResponse.name).to.equal(requstBodySkill.name);
    expect(skillFromResponse.rate).to.equal(requstBodySkill.rate);
    expect(skillFromResponse.updatedAt).to.be.an("string");

    const skills = await testApp.services.storages.skillsStorage.getAll();
    const createdSkill = skills.find(skill => skill.skillId === skillFromResponse.skillId);

    expect(createdSkill).to.not.be.undefined;
    expect(createdSkill?.skillId).to.be.an("number");
    expect(createdSkill?.name).to.equal(requstBodySkill.name);
    expect(createdSkill?.rate).to.equal(requstBodySkill.rate);
    expect(createdSkill?.updatedAt instanceof Date).to.equal(true);
  });

  it("should return error when skill rate is not valid", async () => {
    const requstBodySkill = {
      name: "New Test Skill",
      rate: 15,
    };
    const response = await agent.post("/skills").send(requstBodySkill);
    expect(response.status).to.equal(400);

    const responseBody = response.body;

    expect(responseBody.message).to.equal("Invalid skill rate");
  });
});
