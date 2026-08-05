import * as repo from "../repositories/authorized_user.repo.mjs";
import { CustomError } from "../utils/custom_error.mjs";

// ============================================================
// HELPERS
// ============================================================

const validateId = (
    id,
    field = "user id"
) => {
    const value = Number(id);

    if (
        !Number.isInteger(value) ||
        value <= 0
    ) {
        throw new CustomError(
            `Invalid ${field}`,
            400
        );
    }

    return value;
};

const requiredString = (
    value,
    field
) => {
    if (
        typeof value !== "string" ||
        !value.trim()
    ) {
        throw new CustomError(
            `${field} is required`,
            400
        );
    }

    return value.trim();
};

const optionalString = (
    value,
    field
) => {
    if (value === undefined) {
        return undefined;
    }

    if (value === null) {
        return null;
    }

    if (typeof value !== "string") {
        throw new CustomError(
            `${field} must be a string`,
            400
        );
    }

    return value.trim() || null;
};

const validateBoolean = (
    value,
    field
) => {
    if (
        value !== undefined &&
        typeof value !== "boolean"
    ) {
        throw new CustomError(
            `${field} must be boolean`,
            400
        );
    }

    return value;
};

const validateBattalion =
    async (battalionId) => {

        const id = validateId(
            battalionId,
            "battalion id"
        );

        const exists =
            await repo.battalionExistsRepo(
                id
            );

        if (!exists) {
            throw new CustomError(
                "Battalion not found",
                404
            );
        }

        return id;
    };

// ============================================================
// CREATE
// ============================================================

export const createAuthorizedUser =
    async (body = {}) => {

        const {
            userId,
            name,
            password,
            post,
            battalionId,

            isActive,
            isShowContact,
            isShowFemale,
            isAddBranch,
            isAddPerson,
        } = body;

        const cleanUserId =
            requiredString(
                userId,
                "User ID"
            );

        const cleanName =
            requiredString(
                name,
                "Name"
            );

        const cleanPassword =
            requiredString(
                password,
                "Password"
            );

        const battalion =
            await validateBattalion(
                battalionId
            );

        validateBoolean(
            isActive,
            "isActive"
        );

        validateBoolean(
            isShowContact,
            "isShowContact"
        );

        validateBoolean(
            isShowFemale,
            "isShowFemale"
        );

        validateBoolean(
            isAddBranch,
            "isAddBranch"
        );

        validateBoolean(
            isAddPerson,
            "isAddPerson"
        );

        // User ID duplicate check

        const existing =
            await repo
                .getAuthorizedUserByUserIdRepo(
                    cleanUserId
                );

        if (existing) {
            throw new CustomError(
                "User ID already exists",
                409
            );
        }

        return repo.createAuthorizedUserRepo({
            userId: cleanUserId,

            name: cleanName,

            password:
                cleanPassword,

            post:
                optionalString(
                    post,
                    "post"
                ),

            battalionId:
                battalion,

            isActive:
                isActive ?? true,

            isShowContact:
                isShowContact ?? false,

            isShowFemale:
                isShowFemale ?? false,

            isAddBranch:
                isAddBranch ?? false,

            isAddPerson:
                isAddPerson ?? false,
        });
    };

// ============================================================
// GET ALL
// ============================================================

export const getAuthorizedUsers =
    async () => {

        return repo
            .getAuthorizedUsersRepo();
    };

// ============================================================
// GET BY ID
// ============================================================

export const getAuthorizedUserById =
    async (id) => {

        const userId =
            validateId(id);

        const user =
            await repo
                .getAuthorizedUserByIdRepo(
                    userId
                );

        if (!user) {
            throw new CustomError(
                "Authorized user not found",
                404
            );
        }

        return user;
    };

// ============================================================
// UPDATE
// ============================================================

export const updateAuthorizedUser =
    async (
        id,
        body = {}
    ) => {

        const idValue =
            validateId(id);

        const existing =
            await repo
                .getAuthorizedUserByIdRepo(
                    idValue
                );

        if (!existing) {
            throw new CustomError(
                "Authorized user not found",
                404
            );
        }

        const allowedFields = [
            "userId",
            "name",
            "post",
            "battalionId",
            "isActive",
            "isShowContact",
            "isShowFemale",
            "isAddBranch",
            "isAddPerson",
        ];

        const fields =
            Object.keys(body);

        if (
            !fields.some((field) =>
                allowedFields.includes(
                    field
                )
            )
        ) {
            throw new CustomError(
                "No valid fields provided for update",
                400
            );
        }

        const data = {};

        // USER ID

        if (body.userId !== undefined) {

            const userId =
                requiredString(
                    body.userId,
                    "User ID"
                );

            const duplicate =
                await repo
                    .getAuthorizedUserByUserIdRepo(
                        userId
                    );

            if (
                duplicate &&
                Number(duplicate.id) !==
                idValue
            ) {
                throw new CustomError(
                    "User ID already exists",
                    409
                );
            }

            data.userId =
                userId;
        }

        // NAME

        if (body.name !== undefined) {
            data.name =
                requiredString(
                    body.name,
                    "Name"
                );
        }

        // POST

        if (body.post !== undefined) {
            data.post =
                optionalString(
                    body.post,
                    "post"
                );
        }

        // BATTALION

        if (
            body.battalionId !==
            undefined
        ) {
            data.battalionId =
                await validateBattalion(
                    body.battalionId
                );
        }

        // BOOLEAN PERMISSIONS

        const booleanFields = [
            "isActive",
            "isShowContact",
            "isShowFemale",
            "isAddBranch",
            "isAddPerson",
        ];

        for (
            const field
            of booleanFields
        ) {
            if (
                body[field] !==
                undefined
            ) {
                data[field] =
                    validateBoolean(
                        body[field],
                        field
                    );
            }
        }

        return repo
            .updateAuthorizedUserRepo(
                idValue,
                data
            );
    };

// ============================================================
// CHANGE PASSWORD
// ============================================================

export const changeAuthorizedUserPassword =
    async (
        id,
        body = {}
    ) => {

        const userId =
            validateId(id);

        const password =
            requiredString(
                body.password,
                "Password"
            );

        const existing =
            await repo
                .getAuthorizedUserByIdRepo(
                    userId
                );

        if (!existing) {
            throw new CustomError(
                "Authorized user not found",
                404
            );
        }

        await repo.updatePasswordRepo(
            userId,
            password
        );

        return {
            id: userId,
        };
    };

// ============================================================
// DELETE
// ============================================================

export const deleteAuthorizedUser =
    async (id) => {

        const userId =
            validateId(id);

        const user =
            await repo
                .deleteAuthorizedUserRepo(
                    userId
                );

        if (!user) {
            throw new CustomError(
                "Authorized user not found",
                404
            );
        }

        return user;
    };

export const loginAuthorizedUser = async (
    body = {}
) => {
    const userId = requiredString(
        body.userId,
        "User ID"
    );

    const password = requiredString(
        body.password,
        "Password"
    );

    const user =
        await repo.loginAuthorizedUserRepo(
            userId
        );

    if (!user) {
        throw new CustomError(
            "Invalid User ID or password",
            401
        );
    }

    if (user.password !== password) {
        throw new CustomError(
            "Invalid User ID or password",
            401
        );
    }

    if (!user.is_active) {
        throw new CustomError(
            "User is disabled",
            403
        );
    }

    delete user.password;

    return user;
};