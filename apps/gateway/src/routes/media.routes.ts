import { Router, type Router as ExpressRouter } from "express";
import { generatePresignedUrl, completeUpload, collectionDeletion } from "../controllers/media.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router: ExpressRouter = Router();

router.route("/presigned-url").get(authenticate,generatePresignedUrl);
router.route("/complete").post(authenticate,completeUpload);
router.route("/:collectionId").delete(authenticate,collectionDeletion);

export default router;