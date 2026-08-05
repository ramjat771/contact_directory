import {
    Router,
} from "express";

import * as controller from "../controller/authorized_user.controller.mjs";

const router = Router();

// CREATE
router.post(
    "/login",
    controller.loginAuthorizedUserController
);
router.post(
    "/",
    controller.createAuthorizedUserController
);

// GET ALL

router.get(
    "/",
    controller.getAuthorizedUsersController
);

// GET ONE

router.get(
    "/:id",
    controller.getAuthorizedUserByIdController
);

// UPDATE

router.patch(
    "/:id",
    controller.updateAuthorizedUserController
);

// PASSWORD

router.patch(
    "/:id/password",
    controller.changePasswordController
);

// DELETE

router.delete(
    "/:id",
    controller.deleteAuthorizedUserController
);

export default router;