import { Router } from "express";
import * as controller from "../controller/branch.controller.mjs";

const router = Router();

// CREATE
router.post(
    "/",
    controller.createBranchController
);

// GET ALL
router.get(
    "/",
    controller.getBranchesController
);

// GET BY BATTALION
router.get(
    "/battalion/:battalionId",
    controller.getBranchesByBattalionController
);

// GET BY ID
router.get(
    "/:id",
    controller.getBranchByIdController
);

// UPDATE
router.patch(
    "/:id",
    controller.updateBranchController
);

// DELETE
router.delete(
    "/:id",
    controller.deleteBranchController
);

export default router;