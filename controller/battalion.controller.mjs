import * as service from "../services/battalion.service.mjs";
import { successResponse } from "../utils/api_response.mjs";

export const createBattalionController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.createBattalion(
                req.body
            );

        return successResponse(
            res,
            data,
            "Battalion created successfully"
        );
    } catch (err) {
        next(err);
    }
};

export const getBattalionsController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.getBattalions();

        return successResponse(
            res,
            data,
            "Battalions fetched successfully"
        );
    } catch (err) {
        next(err);
    }
};

export const getBattalionByIdController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.getBattalionById(
                req.params.id
            );

        return successResponse(
            res,
            data,
            "Battalion fetched successfully"
        );
    } catch (err) {
        next(err);
    }
};

export const updateBattalionController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.updateBattalion(
                req.params.id,
                req.body
            );

        return successResponse(
            res,
            data,
            "Battalion updated successfully"
        );
    } catch (err) {
        next(err);
    }
};

export const deleteBattalionController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.deleteBattalion(
                req.params.id
            );

        return successResponse(
            res,
            data,
            "Battalion deleted successfully"
        );
    } catch (err) {
        next(err);
    }
};