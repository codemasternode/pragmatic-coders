import { Request, Response } from "express";
import { AppServices } from "app/app-services";
import { HttpErrorResponse } from "app/utils";

export const removeSkillController = (app: AppServices) => {
    return async (
        req: Request<{ skillId: number }, {}, {}, {}>,
        res: Response<{}>
    ) => {
        const numberOfRemovedRows = await app.storages.skillsStorage.remove(req.params.skillId);

        if (numberOfRemovedRows === 0) {
            throw new HttpErrorResponse(400, {
                message: `Skill doesn't exist`
            })
        }

        return res.status(200).send();
    };
};
