import * as service from "../services/personnel.service.mjs";
import { successResponse } from "../utils/api_response.mjs";

export const createPersonnelController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.createPersonnel(req.body);

        return successResponse(
            res,
            data,
            "Personnel created successfully"
        );
    } catch (err) {
        next(err);
    }
};

export const getPersonnelController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.getPersonnel();

        return successResponse(
            res,
            data,
            "Personnel fetched successfully"
        );
    } catch (err) {
        next(err);
    }
};

export const getPersonnelByIdController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.getPersonnelById(
                req.params.id
            );

        return successResponse(
            res,
            data,
            "Personnel fetched successfully"
        );
    } catch (err) {
        next(err);
    }
};

export const updatePersonnelController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.updatePersonnel(
                req.params.id,
                req.body
            );

        return successResponse(
            res,
            data,
            "Personnel updated successfully"
        );
    } catch (err) {
        next(err);
    }
};

export const deletePersonnelController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.deletePersonnel(
                req.params.id
            );

        return successResponse(
            res,
            data,
            "Personnel deleted successfully"
        );
    } catch (err) {
        next(err);
    }
};