import * as repo from "../repositories/battalion.repo.mjs";
import { CustomError } from "../utils/custom_error.mjs";

const validateId = (id) => {
    const parsedId = Number(id);

    if (
        !Number.isInteger(parsedId) ||
        parsedId <= 0
    ) {
        throw new CustomError(
            "Invalid battalion id",
            400
        );
    }

    return parsedId;
};

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

const validateLocation = (
    latitude,
    longitude
) => {
    if (
        latitude === undefined &&
        longitude === undefined
    ) {
        return;
    }

    // Location clear karna
    if (
        latitude === null &&
        longitude === null
    ) {
        return;
    }

    // Coordinate update ke liye dono required
    if (
        latitude === undefined ||
        longitude === undefined ||
        latitude === null ||
        longitude === null ||
        latitude === "" ||
        longitude === ""
    ) {
        throw new CustomError(
            "Both latitude and longitude are required",
            400
        );
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
        !Number.isFinite(lat) ||
        lat < -90 ||
        lat > 90
    ) {
        throw new CustomError(
            "Invalid latitude",
            400
        );
    }

    if (
        !Number.isFinite(lng) ||
        lng < -180 ||
        lng > 180
    ) {
        throw new CustomError(
            "Invalid longitude",
            400
        );
    }
};

export const createBattalion = async (
    body = {}
) => {
    const {
        name,
        battalionNumber,
        address,
        latitude,
        longitude,
        isActive,
    } = body;

    if (
        typeof name !== "string" ||
        !name.trim()
    ) {
        throw new CustomError(
            "Battalion name is required",
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

    validateLocation(
        latitude,
        longitude
    );

    return repo.createBattalionRepo({
        name: name.trim(),

        battalionNumber:
            normalizeOptionalString(
                battalionNumber,
                "battalionNumber"
            ),

        address:
            normalizeOptionalString(
                address,
                "address"
            ),

        latitude:
            latitude != null
                ? Number(latitude)
                : null,

        longitude:
            longitude != null
                ? Number(longitude)
                : null,

        isActive:
            isActive ?? true,
    });
};

export const getBattalions = async () => {
    return repo.getBattalionsRepo();
};

export const getBattalionById = async (
    id
) => {
    const battalionId =
        validateId(id);

    const battalion =
        await repo.getBattalionByIdRepo(
            battalionId
        );

    if (!battalion) {
        throw new CustomError(
            "Battalion not found",
            404
        );
    }

    return battalion;
};

export const updateBattalion = async (
    id,
    body = {}
) => {
    const battalionId =
        validateId(id);

    const allowedFields = [
        "name",
        "battalionNumber",
        "address",
        "latitude",
        "longitude",
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
        await repo.getBattalionByIdRepo(
            battalionId
        );

    if (!existing) {
        throw new CustomError(
            "Battalion not found",
            404
        );
    }

    const {
        name,
        battalionNumber,
        address,
        latitude,
        longitude,
        isActive,
    } = body;

    if (name !== undefined) {
        if (
            typeof name !== "string" ||
            !name.trim()
        ) {
            throw new CustomError(
                "Battalion name cannot be empty",
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

    validateLocation(
        latitude,
        longitude
    );

    return repo.updateBattalionRepo(
        battalionId,
        {
            name:
                name !== undefined
                    ? name.trim()
                    : undefined,

            battalionNumber:
                normalizeOptionalString(
                    battalionNumber,
                    "battalionNumber"
                ),

            address:
                normalizeOptionalString(
                    address,
                    "address"
                ),

            latitude:
                latitude !== undefined &&
                    latitude !== null
                    ? Number(latitude)
                    : latitude,

            longitude:
                longitude !== undefined &&
                    longitude !== null
                    ? Number(longitude)
                    : longitude,

            isActive,
        }
    );
};

export const deleteBattalion = async (
    id
) => {
    const battalionId =
        validateId(id);

    const battalion =
        await repo.deleteBattalionRepo(
            battalionId
        );

    if (!battalion) {
        throw new CustomError(
            "Battalion not found",
            404
        );
    }

    return battalion;
};