import * as repo from "../repositories/personnel.repo.mjs";
import { CustomError } from "../utils/custom_error.mjs";

const validateId = (
    id,
    name = "personnel id"
) => {
    const value = Number(id);

    if (
        !Number.isInteger(value) ||
        value <= 0
    ) {
        throw new CustomError(
            `Invalid ${name}`,
            400
        );
    }

    return value;
};

const text = (value) => {
    if (value === undefined) {
        return undefined;
    }

    if (value === null) {
        return null;
    }

    if (typeof value !== "string") {
        throw new CustomError(
            "Invalid text value",
            400
        );
    }

    return value.trim() || null;
};

const gender = (value) => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return value || null;
    }

    const g =
        String(value)
            .trim()
            .toUpperCase();

    if (
        !["M", "F", "O"].includes(g)
    ) {
        throw new CustomError(
            "Gender must be M, F or O",
            400
        );
    }

    return g;
};

const validateRelations = async (
    battalionId,
    branchId
) => {
    const battalion =
        await repo.getBattalionExistsRepo(
            battalionId
        );

    if (!battalion) {
        throw new CustomError(
            "Battalion not found",
            404
        );
    }

    const branch =
        await repo.getBranchExistsRepo(
            branchId,
            battalionId
        );

    if (!branch) {
        throw new CustomError(
            "Invalid branch for selected battalion",
            400
        );
    }
};

// CREATE

export const createPersonnel = async (
    body = {}
) => {
    const battalionId =
        validateId(
            body.battalionId,
            "battalion id"
        );

    const branchId =
        validateId(
            body.branchId,
            "branch id"
        );

    if (
        typeof body.name !== "string" ||
        !body.name.trim()
    ) {
        throw new CustomError(
            "Personnel name is required",
            400
        );
    }

    if (
        body.isActive !== undefined &&
        typeof body.isActive !== "boolean"
    ) {
        throw new CustomError(
            "isActive must be boolean",
            400
        );
    }

    await validateRelations(
        battalionId,
        branchId
    );

    return repo.createPersonnelRepo({
        battalionId,
        branchId,

        name:
            body.name.trim(),

        beltNumber:
            text(body.beltNumber),

        post:
            text(body.post),

        phoneNumber:
            text(body.phoneNumber),

        email:
            text(body.email),

        photoUrl:
            text(body.photoUrl),

        remarks:
            text(body.remarks),

        gender:
            gender(body.gender),

        isActive:
            body.isActive ?? true,
    });
};

// GET ALL

export const getPersonnel = () =>
    repo.getPersonnelRepo();

// GET BY ID

export const getPersonnelById = async (
    id
) => {
    const personnelId =
        validateId(id);

    const data =
        await repo.getPersonnelByIdRepo(
            personnelId
        );

    if (!data) {
        throw new CustomError(
            "Personnel not found",
            404
        );
    }

    return data;
};

// UPDATE

export const updatePersonnel = async (
    id,
    body = {}
) => {
    const personnelId =
        validateId(id);

    const existing =
        await repo.getPersonnelByIdRepo(
            personnelId
        );

    if (!existing) {
        throw new CustomError(
            "Personnel not found",
            404
        );
    }

    const battalionId =
        body.battalionId !== undefined
            ? validateId(
                body.battalionId,
                "battalion id"
            )
            : Number(
                existing.battalion_id
            );

    const branchId =
        body.branchId !== undefined
            ? validateId(
                body.branchId,
                "branch id"
            )
            : Number(
                existing.branch_id
            );

    if (
        body.battalionId !== undefined ||
        body.branchId !== undefined
    ) {
        await validateRelations(
            battalionId,
            branchId
        );
    }

    if (
        body.name !== undefined &&
        (
            typeof body.name !== "string" ||
            !body.name.trim()
        )
    ) {
        throw new CustomError(
            "Personnel name cannot be empty",
            400
        );
    }

    if (
        body.isActive !== undefined &&
        typeof body.isActive !== "boolean"
    ) {
        throw new CustomError(
            "isActive must be boolean",
            400
        );
    }

    return repo.updatePersonnelRepo(
        personnelId,
        {
            battalionId:
                body.battalionId !== undefined
                    ? battalionId
                    : undefined,

            branchId:
                body.branchId !== undefined
                    ? branchId
                    : undefined,

            name:
                body.name !== undefined
                    ? body.name.trim()
                    : undefined,

            beltNumber:
                text(body.beltNumber),

            post:
                text(body.post),

            phoneNumber:
                text(body.phoneNumber),

            email:
                text(body.email),

            photoUrl:
                text(body.photoUrl),

            remarks:
                text(body.remarks),

            gender:
                body.gender !== undefined
                    ? gender(body.gender)
                    : undefined,

            isActive:
                body.isActive,
        }
    );
};

// DELETE

export const deletePersonnel = async (
    id
) => {
    const personnelId =
        validateId(id);

    const data =
        await repo.deletePersonnelRepo(
            personnelId
        );

    if (!data) {
        throw new CustomError(
            "Personnel not found",
            404
        );
    }

    return data;
};


export const getPersonnelByBattalionAndBranch = async (
    battalionId,
    branchId
) => {
    const validBattalionId = validateId(
        battalionId,
        "battalion id"
    );

    const validBranchId = validateId(
        branchId,
        "branch id"
    );

    await validateRelations(
        validBattalionId,
        validBranchId
    );

    return repo.getPersonnelByBattalionAndBranchRepo(
        validBattalionId,
        validBranchId
    );
};