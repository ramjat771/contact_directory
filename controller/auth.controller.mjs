import * as service
    from "../services/auth.service.mjs";

import { successResponse }
    from "../utils/api_response.mjs";

export const loginController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.login(
                req.body
            );

        return successResponse(
            res,
            data,
            "Login successful"
        );

    } catch (err) {
        next(err);
    }
};