import { Router } from "express";
import { getAllSoldiersFromRaid, startRaid } from "../controllers/raidController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post('/start', startRaid);

router.get("/soldiers/:raidId", getAllSoldiersFromRaid);

export { router };
