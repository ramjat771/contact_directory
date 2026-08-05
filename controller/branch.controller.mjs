import * as service from "../services/branch.service.mjs";
import { successResponse } from "../utils/api_response.mjs";

// ============================================================
// CREATE
// ============================================================

export const createBranchController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.createBranch(
                req.body
            );

        return successResponse(
            res,
            data,
            "Branch created successfully"
        );
    } catch (err) {
        next(err);
    }
};

// ============================================================
// GET ALL
// ============================================================

export const getBranchesController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.getBranches();

        return successResponse(
            res,
            data,
            "Branches fetched successfully"
        );
    } catch (err) {
        next(err);
    }
};

// ============================================================
// GET BY ID
// ============================================================

export const getBranchByIdController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.getBranchById(
                req.params.id
            );

        return successResponse(
            res,
            data,
            "Branch fetched successfully"
        );
    } catch (err) {
        next(err);
    }
};

// ============================================================
// GET BY BATTALION
// ============================================================

export const getBranchesByBattalionController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.getBranchesByBattalion(
                req.params.battalionId
            );

        return successResponse(
            res,
            data,
            "Battalion branches fetched successfully"
        );
    } catch (err) {
        next(err);
    }
};

// ============================================================
// UPDATE
// ============================================================

export const updateBranchController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.updateBranch(
                req.params.id,
                req.body
            );

        return successResponse(
            res,
            data,
            "Branch updated successfully"
        );
    } catch (err) {
        next(err);
    }
};

// ============================================================
// DELETE
// ============================================================

export const deleteBranchController = async (
    req,
    res,
    next
) => {
    try {
        const data =
            await service.deleteBranch(
                req.params.id
            );

        return successResponse(
            res,
            data,
            "Branch deleted successfully"
        );
    } catch (err) {
        next(err);
    }
};