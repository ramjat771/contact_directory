import * as service from "../services/authorized_user.service.mjs";

import {
    successResponse,
} from "../utils/api_response.mjs";

// ============================================================
// CREATE
// ============================================================

export const createAuthorizedUserController =
    async (
        req,
        res,
        next
    ) => {
        try {
            const data =
                await service
                    .createAuthorizedUser(
                        req.body
                    );

            return successResponse(
                res,
                data,
                "Authorized user created successfully"
            );

        } catch (err) {
            next(err);
        }
    };

// ============================================================
// GET ALL
// ============================================================

export const getAuthorizedUsersController =
    async (
        req,
        res,
        next
    ) => {
        try {
            const data =
                await service
                    .getAuthorizedUsers();

            return successResponse(
                res,
                data,
                "Authorized users fetched successfully"
            );

        } catch (err) {
            next(err);
        }
    };

// ============================================================
// GET BY ID
// ============================================================

export const getAuthorizedUserByIdController =
    async (
        req,
        res,
        next
    ) => {
        try {
            const data =
                await service
                    .getAuthorizedUserById(
                        req.params.id
                    );

            return successResponse(
                res,
                data,
                "Authorized user fetched successfully"
            );

        } catch (err) {
            next(err);
        }
    };

// ============================================================
// UPDATE
// ============================================================

export const updateAuthorizedUserController =
    async (
        req,
        res,
        next
    ) => {
        try {
            const data =
                await service
                    .updateAuthorizedUser(
                        req.params.id,
                        req.body
                    );

            return successResponse(
                res,
                data,
                "Authorized user updated successfully"
            );

        } catch (err) {
            next(err);
        }
    };

// ============================================================
// CHANGE PASSWORD
// ============================================================

export const changePasswordController =
    async (
        req,
        res,
        next
    ) => {
        try {
            const data =
                await service
                    .changeAuthorizedUserPassword(
                        req.params.id,
                        req.body
                    );

            return successResponse(
                res,
                data,
                "Password changed successfully"
            );

        } catch (err) {
            next(err);
        }
    };

// ============================================================
// DELETE
// ============================================================

export const deleteAuthorizedUserController =
    async (
        req,
        res,
        next
    ) => {
        try {
            const data =
                await service
                    .deleteAuthorizedUser(
                        req.params.id
                    );

            return successResponse(
                res,
                data,
                "Authorized user deleted successfully"
            );

        } catch (err) {
            next(err);
        }
    };


export const loginAuthorizedUserController =
    async (
        req,
        res,
        next
    ) => {
        try {
            const data =
                await service.loginAuthorizedUser(
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