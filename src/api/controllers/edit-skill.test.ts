import chai, { expect } from "chai";
import { getTestApp, TestApp } from "app/setup-integration-tests.test";
import { SkillDto } from "../dtos/SkillDto";

describe("editSkillController", () => {
    let testApp: TestApp;
    let agent: ChaiHttp.Agent;

    beforeEach(async () => {
        testApp = await getTestApp();
        agent = chai.request.agent(testApp.app);
    });

    it("should update skill when send name only", async () => {
        const skillToTest = await testApp.services.storages.skillsStorage.insert({
            name: "TypeScript",
            rate: 8,
        });
        const skillIdToTest = skillToTest.skillId

        const requstBodySkill = {
            name: "New Test Skill Update"
        };

        const response = await agent.put(`/skills/${skillIdToTest}`).send(requstBodySkill);
        expect(response.status).to.equal(200);

        const skillFromResponse = response.body as SkillDto;

        expect(skillFromResponse.skillId).to.be.an("number");
        expect(skillFromResponse.name).to.equal(requstBodySkill.name);
        expect(skillFromResponse.rate).to.equal(skillToTest.rate);
        expect(skillFromResponse.updatedAt).to.be.an("string");

        const skills = await testApp.services.storages.skillsStorage.getAll();
        const createdSkill = skills.find(skill => skill.skillId === skillFromResponse.skillId);

        expect(createdSkill).to.not.be.undefined;
        expect(createdSkill?.skillId).to.be.an("number");
        expect(createdSkill?.name).to.equal(requstBodySkill.name);
        expect(createdSkill?.rate).to.equal(skillToTest.rate);
        expect(createdSkill?.updatedAt instanceof Date).to.equal(true);

    })

    it("should update skill when skill rate is valid", async () => {
        const skillToTest = await testApp.services.storages.skillsStorage.insert({
            name: "TypeScript",
            rate: 8,
        });
        const skillIdToTest = skillToTest.skillId

        const requstBodySkill = {
            name: "New Test Skill Update",
            rate: 5,
        };

        const response = await agent.put(`/skills/${skillIdToTest}`).send(requstBodySkill);
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
        const skillToTest = await testApp.services.storages.skillsStorage.insert({
            name: "TypeScript",
            rate: 8,
        });
        const skillIdToTest = skillToTest.skillId

        const requstBodySkill = {
            name: "New Test Skill Update",
            rate: 15,
        };

        const response = await agent.put(`/skills/${skillIdToTest}`).send(requstBodySkill);
        expect(response.status).to.equal(400);
        const responseBody = response.body;
        expect(responseBody.message).to.equal("Invalid skill rate");
    });

    it("should return error when skill doesn't exist", async () => {
        const requstBodySkill = {
            name: "New Test Skill Update",
            rate: 5,
        };

        const response = await agent.put(`/skills/-1`).send(requstBodySkill);
        expect(response.status).to.equal(400);
        const responseBody = response.body;
        expect(responseBody.message).to.equal(`Skill doesn't exist`);
    })

});
