import { Router } from "express";
import * as controller from "../controller/personnel.controller.mjs";

const router = Router();

router.post(
    "/",
    controller.createPersonnelController
);

router.get(
    "/",
    controller.getPersonnelController
);

router.get(
    "/:id",
    controller.getPersonnelByIdController
);


// Battalion + Branch wise personnel
router.get(
    "/battalion/:battalionId/branch/:branchId",
    controller.getPersonnelByBattalionAndBranchController
);


router.patch(
    "/:id",
    controller.updatePersonnelController
);

router.delete(
    "/:id",
    controller.deletePersonnelController
);




export default router;