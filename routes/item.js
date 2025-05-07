import { Router } from "express";
import { createItems, getAllItems, getAllLoot, getRaidLoot } from "../controllers/itemController.js";

const router = Router();

router.get('/', getAllItems)
router.get('/loot', getAllLoot)
router.post('/all', createItems)

router.get('/:id/loot', getRaidLoot)

export { router };
