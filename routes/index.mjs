import { Router } from "express";
import battalionRoutes from "./battalion.routes.mjs";
import authRoutes from "./auth.routes.mjs";
import authorizedUserRoutes from "./authorized_user.routes.mjs";
import branchRoutes from "./branch.routes.mjs";
import personnelRoutes from "./personnel.routes.mjs";
const router = Router();
router.use(
    "/auth",
    authRoutes
);

router.use(
    "/battalions",
    battalionRoutes
);
router.use(
    "/authorized-users",
    authorizedUserRoutes
);
router.use(
    "/branches",
    branchRoutes
);
router.use(
    "/personnel",
    personnelRoutes
);
export default router;