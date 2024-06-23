import { Router } from "express"; 
import { verifyJWT, upload } from "../middlewares/index.js";
import { newArticle } from "../controllers/article.controller.js";

const router = Router();

router.route('/create').post(verifyJWT, upload.single('coverImage'), newArticle)

export { router as articleRouter }