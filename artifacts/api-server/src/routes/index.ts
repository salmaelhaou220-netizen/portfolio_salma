import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import documentsRouter from "./documents";
import photoRouter from "./photo";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(documentsRouter);
router.use(photoRouter);

export default router;
