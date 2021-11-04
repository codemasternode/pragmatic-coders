import { Request, Response } from "express";
import { AppServices } from "app/app-services";
import { SkillDto, toSkillDto } from "app/api/dtos/SkillDto";
import { HttpErrorResponse } from "app/utils";

export const editSkillController = (app: AppServices) => {
    return async (
        req: Request<{ skillId: number }, {}, { name?: string; rate?: number }, {}>,
        res: Response<SkillDto>
    ) => {
        const requestBody = req.body;
        if (requestBody.rate && (requestBody.rate > 10 || requestBody.rate < 0)) {
            throw new HttpErrorResponse(400, {
                message: "Invalid skill rate",
            });
        }
        const updatedSkill = await app.storages.skillsStorage.update(
            req.params.skillId,
            requestBody
        );

        if (!updatedSkill) {
            throw new HttpErrorResponse(400, {
                message: `Skill doesn't exist`
            })
        }

        return res.status(200).send(toSkillDto(updatedSkill));
    };
};
