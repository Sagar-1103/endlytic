import { Router, type Router as ExpressRouter } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { generateQueryResponse } from "../controllers/query.controller";

const router:ExpressRouter=Router()

router.route("/").get(authenticate,generateQueryResponse);

export default router;