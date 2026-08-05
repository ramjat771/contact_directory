import * as repo
    from "../repositories/auth.repo.mjs";

import { CustomError }
    from "../utils/custom_error.mjs";

export const login = async (
    body = {}
) => {
    const {
        userId,
        password,
    } = body;

    if (!userId?.trim()) {
        throw new CustomError(
            "User ID is required",
            400
        );
    }

    if (!password) {
        throw new CustomError(
            "Password is required",
            400
        );
    }

    const user =
        await repo.findUserByUserIdRepo(
            userId.trim()
        );

    if (!user) {
        throw new CustomError(
            "Invalid User ID or password",
            401
        );
    }

    if (!user.isActive) {
        throw new CustomError(
            "Your account is disabled",
            403
        );
    }

    if (user.password !== password) {
        throw new CustomError(
            "Invalid User ID or password",
            401
        );
    }

    // Password frontend ko kabhi return nahi karna.
    return {
        id: user.id ?? null,
        userId: user.userId,
        name: user.name,
        post: user.post,
        battalionId:
            user.battalionId ?? null,
        isActive: user.isActive,
    };
};