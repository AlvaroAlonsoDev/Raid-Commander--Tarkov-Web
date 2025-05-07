import { createRaidForPlayer, getAllSoldiersFromRaidService } from "../services/raidService.js";

/**
 * Inicia una raid para un jugador
 */
export const startRaid = async (req, res) => {
    try {
        // const playerId = req.user.id;
        const playerId = '1234567890';
        const { raid, startingNodeId } = await createRaidForPlayer(playerId);

        res.status(201).json({
            message: "Raid iniciada correctamente",
            raidId: raid._id,
            raid: await raid.populate("nodes.loot"), // opcional si quieres loot expandido
            startingNodeId
        });
    } catch (error) {
        console.error("Error al iniciar raid:", error);
        res.status(500).json({ error: "No se pudo iniciar la raid" });
    }
};

/**
 * Obtiene todos los soldados de una raid
 */
export const getAllSoldiersFromRaid = async (req, res) => {
    try {
        const { raidId } = req.params;
        const data = await getAllSoldiersFromRaidService(raidId);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error al obtener soldados:", error);
        res.status(500).json({ error: error.message || "Error interno al obtener soldados de la raid." });
    }
};
