import { Router } from "express";
import * as controller from "../controller/battalion.controller.mjs";

const router = Router();

router.post(
    "/",
    controller.createBattalionController
);

router.get(
    "/",
    controller.getBattalionsController
);

router.get(
    "/:id",
    controller.getBattalionByIdController
);

router.patch(
    "/:id",
    controller.updateBattalionController
);

router.delete(
    "/:id",
    controller.deleteBattalionController
);

export default router;