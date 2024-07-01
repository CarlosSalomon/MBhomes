import { Router } from "express";
import {usersControllers} from "../controllers/usersControllers.js"
import { multerUploads } from "../utils.js";

const router = Router()


router.post("/premium/:uid", usersControllers.changeRolController );
router.post("/:uid/documents",multerUploads.array("file"),usersControllers.documentsController);  

export default router;