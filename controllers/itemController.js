import { createManyItems, getAllItemsService, getLootByIds } from "../services/itemService.js";
import RaidModel from "../models/raid.js";
import ItemModel from "../models/item.js";


export const getAllItems = async (req, res) => {
    try {
        const items = getAllItemsService(); // Asumiendo que tienes una función para obtener todos los ítems
        res.status(200).json(items);
    } catch (error) {
        console.error("Error al obtener ítems:", error);
        res.status(500).json({ error: "No se pudieron obtener los ítems." });
    }
}

export const getAllLoot = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ error: "Debes proporcionar un array de IDs en el cuerpo (ids: [])." });
        }

        const items = await getLootByIds(ids);
        res.status(200).json(items);
    } catch (error) {
        console.error("Error al obtener loot:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener loot." });
    }
};


export const createItems = async (req, res) => {
    try {
        const itemsArray = req.body;

        if (!Array.isArray(itemsArray)) {
            return res.status(400).json({ error: "El cuerpo de la solicitud debe ser un array de ítems." });
        }

        const result = await createManyItems(itemsArray);
        res.status(201).json({
            message: `${result.length} ítems creados correctamente.`,
            items: result
        });
    } catch (error) {
        console.error("Error al crear ítems:", error);
        res.status(500).json({ error: "No se pudieron crear los ítems." });
    }
};

// borrar?
export const getRaidLoot = async (req, res) => {
    try {
        const { id } = req.params;

        const raid = await RaidModel.findById(id).lean();

        if (!raid) {
            return res.status(404).json({ error: "Raid no encontrada." });
        }

        // Recopilar todos los IDs únicos de loot
        const allLootIds = raid.nodes.flatMap(node => node.loot);
        const uniqueLootIds = [...new Set(allLootIds.map(id => id.toString()))];

        // Traer solo name y rarity
        const items = await ItemModel.find({ _id: { $in: uniqueLootIds } }, { name: 1, rarity: 1 }).lean();
        const itemsMap = Object.fromEntries(items.map(item => [item._id.toString(), item]));

        // Crear array simplificado
        const simplifiedNodes = raid.nodes.map(node => ({
            id: node.id,
            type: node.type,
            level: node.level,
            loot: node.loot
                .map(itemId => itemsMap[itemId.toString()])
                .filter(Boolean)
        }));

        res.status(200).json(simplifiedNodes);
    } catch (error) {
        console.error("Error al obtener loot de la raid:", error);
        res.status(500).json({ error: "Error interno al recuperar el loot de la raid." });
    }
};