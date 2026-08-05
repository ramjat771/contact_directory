import { Router } from "express";

import {
    loginController
} from "../controller/auth.controller.mjs";

const router = Router();

router.post(
    "/login",
    loginController
);

export default router;