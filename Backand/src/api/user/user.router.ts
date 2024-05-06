import express from "express";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";
import { me } from "./user.controller";
import { show_all_users } from "./user.controller";
import { find_user_by_fullName } from "./user.controller";

const router = express.Router();

router.get("/me", isAuthenticated, me);
router.get("/users", isAuthenticated, show_all_users);
router.get("/user/:fullName", isAuthenticated, find_user_by_fullName);

export default router;
