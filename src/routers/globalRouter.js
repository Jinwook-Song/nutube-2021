import express from "express";
import { join, login } from "../controllers/userController";
import { homepage, search } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", homepage);
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;
