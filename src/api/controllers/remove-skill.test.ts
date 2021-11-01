import chai, { expect } from "chai";
import { getTestApp, TestApp } from "app/setup-integration-tests.test";

describe("removeSkillController", () => {
    let testApp: TestApp;
    let agent: ChaiHttp.Agent;

    beforeEach(async () => {
        testApp = await getTestApp();
        agent = chai.request.agent(testApp.app);
    });

    it("should remove skill", async () => {
        const createdSkill = await testApp.services.storages.skillsStorage.insert({
            name: "Test skill to remove",
            rate: 8,
        });

        const response = await agent.delete(`/skills/${createdSkill.skillId}`)

        expect(response.status).to.equal(200)

        const skills = await testApp.services.storages.skillsStorage.getAll()
        const skill = skills.find(skill => skill.skillId === createdSkill.skillId)
        expect(skill).to.equal(undefined)
    });

    it(`should return error when user remove skill that doesn't exist`, async () => {
        const response = await agent.delete(`/skills/-1`)

        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal(`Skill doesn't exist`)
    })

});
