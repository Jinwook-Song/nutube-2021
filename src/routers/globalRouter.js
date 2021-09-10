import express from "express";
import { join } from "../controllers/userController";
import { homepage } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", homepage);
globalRouter.get("/join", join);

export default globalRouter;
