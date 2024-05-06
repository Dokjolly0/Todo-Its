import express from "express";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";
import {
  add_todo,
  show_todo,
  check_todo,
  uncheck_todo,
  assign_todo,
} from "./todo.controller";
import { validate } from "../../utils/validation-middleware";
import { Add_todo_dto } from "./todo.dto";

const router = express.Router();

router.use(isAuthenticated);
router.get("/", show_todo);
router.post("/", validate(Add_todo_dto), add_todo);
router.patch("/:id/check", check_todo);
router.patch("/:id/uncheck", uncheck_todo);
router.post("/:id/assign", assign_todo);

// router.post("/:id/assign", async (req, res, next) => {
//   try {
//     await assign_todo(req, res, next);
//   } catch (error: any) {
//     if (error.message === "Utente non trovato")
//       res.status(400).json({ "Errore: ": "Utente non trovato" });
//     else if (error.message === "Todo non trovato")
//       res.status(400).json({ "Errore: ": "Todo non trovato" });
//     else if (error.message === "Id non valido")
//       res.status(400).json({ "Errore: ": "Id non valido" });
//     else {
//       res.status(500).json({
//         error: "InternalServerError",
//         message: "The server encountered an internal error",
//       });
//     }
//   }
// });

export default router;
