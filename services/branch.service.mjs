import * as repo from "../repositories/branch.repo.mjs";
import { CustomError } from "../utils/custom_error.mjs";

// ============================================================
// VALIDATE ID
// ============================================================

const validateId = (
    id,
    fieldName = "branch id"
) => {
    const parsedId = Number(id);

    if (
        !Number.isInteger(parsedId) ||
        parsedId <= 0
    ) {
        throw new CustomError(
            `Invalid ${fieldName}`,
            400
        );
    }

    return parsedId;
};

// ============================================================
// OPTIONAL STRING
// ============================================================

const normalizeOptionalString = (
    value,
    fieldName
) => {
    if (value === undefined) {
        return undefined;
    }

    if (value === null) {
        return null;
    }

    if (typeof value !== "string") {
        throw new CustomError(
            `${fieldName} must be a string`,
            400
        );
    }

    const trimmed = value.trim();

    return trimmed || null;
};

// ============================================================
// CREATE
// ============================================================

export const createBranch = async (
    body = {}
) => {
    const {
        battalionId,
        name,
        description,
        isActive,
    } = body;

    const parsedBattalionId =
        validateId(
            battalionId,
            "battalion id"
        );

    if (
        typeof name !== "string" ||
        !name.trim()
    ) {
        throw new CustomError(
            "Branch name is required",
            400
        );
    }

    if (
        isActive !== undefined &&
        typeof isActive !== "boolean"
    ) {
        throw new CustomError(
            "isActive must be boolean",
            400
        );
    }

    const battalion =
        await repo.getBattalionExistsRepo(
            parsedBattalionId
        );

    if (!battalion) {
        throw new CustomError(
            "Battalion not found",
            404
        );
    }

    return repo.createBranchRepo({
        battalionId:
            parsedBattalionId,

        name:
            name.trim(),

        description:
            normalizeOptionalString(
                description,
                "description"
            ),

        isActive:
            isActive ?? true,
    });
};

// ============================================================
// GET ALL
// ============================================================

export const getBranches = async () => {
    return repo.getBranchesRepo();
};

// ============================================================
// GET BY ID
// ============================================================

export const getBranchById = async (
    id
) => {
    const branchId =
        validateId(id);

    const branch =
        await repo.getBranchByIdRepo(
            branchId
        );

    if (!branch) {
        throw new CustomError(
            "Branch not found",
            404
        );
    }

    return branch;
};

// ============================================================
// GET BY BATTALION
// ============================================================

export const getBranchesByBattalion = async (
    battalionId
) => {
    const parsedBattalionId =
        validateId(
            battalionId,
            "battalion id"
        );

    const battalion =
        await repo.getBattalionExistsRepo(
            parsedBattalionId
        );

    if (!battalion) {
        throw new CustomError(
            "Battalion not found",
            404
        );
    }

    return repo.getBranchesByBattalionRepo(
        parsedBattalionId
    );
};

// ============================================================
// UPDATE
// ============================================================

export const updateBranch = async (
    id,
    body = {}
) => {
    const branchId =
        validateId(id);

    const allowedFields = [
        "battalionId",
        "name",
        "description",
        "isActive",
    ];

    const fields =
        Object.keys(body);

    if (
        !fields.some((field) =>
            allowedFields.includes(field)
        )
    ) {
        throw new CustomError(
            "No valid fields provided for update",
            400
        );
    }

    const existing =
        await repo.getBranchByIdRepo(
            branchId
        );

    if (!existing) {
        throw new CustomError(
            "Branch not found",
            404
        );
    }

    const {
        battalionId,
        name,
        description,
        isActive,
    } = body;

    let parsedBattalionId;

    if (battalionId !== undefined) {
        parsedBattalionId =
            validateId(
                battalionId,
                "battalion id"
            );

        const battalion =
            await repo.getBattalionExistsRepo(
                parsedBattalionId
            );

        if (!battalion) {
            throw new CustomError(
                "Battalion not found",
                404
            );
        }
    }

    if (name !== undefined) {
        if (
            typeof name !== "string" ||
            !name.trim()
        ) {
            throw new CustomError(
                "Branch name cannot be empty",
                400
            );
        }
    }

    if (
        isActive !== undefined &&
        typeof isActive !== "boolean"
    ) {
        throw new CustomError(
            "isActive must be boolean",
            400
        );
    }

    return repo.updateBranchRepo(
        branchId,
        {
            battalionId:
                parsedBattalionId,

            name:
                name !== undefined
                    ? name.trim()
                    : undefined,

            description:
                normalizeOptionalString(
                    description,
                    "description"
                ),

            isActive,
        }
    );
};

// ============================================================
// DELETE
// ============================================================

export const deleteBranch = async (
    id
) => {
    const branchId =
        validateId(id);

    const branch =
        await repo.deleteBranchRepo(
            branchId
        );

    if (!branch) {
        throw new CustomError(
            "Branch not found",
            404
        );
    }

    return branch;
};