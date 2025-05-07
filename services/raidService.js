import ItemModel from "../models/item.js";
import RaidModel from "../models/raid.js";
import { map0 } from "../config/map0.js";
import { injectScavsInRaid } from "../services/scavService.js";


/**
 * Genera loot aleatorio desde la base de datos usando spawnChances, rareza y nivel
 */
export async function generateLoot(type, level, nodeId, startingNodeId, guaranteedWeaponNodesUsed) {
    const allItems = await ItemModel.find({ [`spawnChances.${type}`]: { $gt: 0 } });

    const shuffledItems = allItems.sort(() => Math.random() - 0.5);

    const rarityFactor = {
        common: 1.0,
        rare: 0.5,
        epic: 0.2
    };

    const categoryFactor = {
        medical: 1.0,
        loot: 1.0,
        ammo: 0.9,
        tool: 0.9,
        key: 0.8,
        weapon: 0.5,
        trash: 1.1
    };

    const contextualBonus = {
        forest: ["medical", "loot"],
        urban: ["loot", "key"],
        industrial: ["tool", "ammo", "weapon"],
        underground: ["key", "weapon", "ammo"]
    };

    const levelFactor = 0.5 + (level / 20);
    const baseMax = Math.min(1 + Math.floor(level / 3), 5);
    const typeMultiplier = { forest: 1.0, urban: 1.2, industrial: 1.4, underground: 1.5 }[type] || 1.0;
    const maxLoot = Math.round(baseMax * typeMultiplier);

    const loot = [];
    const candidates = [];

    for (const item of shuffledItems) {
        let spawnChance = item.spawnChances[type] || 0;
        if (contextualBonus[type]?.includes(item.category)) {
            spawnChance += 0.05;
        }

        const rarityMult = rarityFactor[item.rarity] || 1.0;
        const categoryMult = categoryFactor[item.category] || 1.0;
        const adjustedChance = spawnChance * rarityMult * categoryMult * levelFactor;

        if (Math.random() < adjustedChance) {
            loot.push(item._id);
            candidates.push(item);
        }

        if (loot.length >= maxLoot) break;
    }

    // Refuerzo para nodos de alto nivel
    if (level >= 8 && candidates.length > 0) {
        const allCommons = candidates.every(i => i.rarity === "common");
        if (allCommons) {
            const betterItem = shuffledItems.find(i =>
                ["rare", "epic"].includes(i.rarity) &&
                (i.spawnChances[type] || 0) > 0 &&
                Math.random() < (
                    (i.spawnChances[type] + (contextualBonus[type]?.includes(i.category) ? 0.05 : 0)) *
                    rarityFactor[i.rarity] *
                    categoryFactor[i.category] *
                    levelFactor
                )
            );

            if (betterItem) {
                loot[loot.length - 1] = betterItem._id;
            }
        }
    }

    // ✅ Garantizar un arma en nodos cercanos al spawn
    let guaranteedWeaponGiven = false;

    if (startingNodeId && guaranteedWeaponNodesUsed < 2) {
        const distance = getNodeDistance(map0, startingNodeId, nodeId);
        if (distance > 0 && distance <= 2) {
            const weapon = await ItemModel.findOne({
                category: "weapon",
                rarity: { $ne: "epic" }
            });

            if (weapon) {
                loot.push(weapon._id);
                guaranteedWeaponGiven = true;
            }
        }
    }

    return { items: loot, guaranteedWeaponGiven };
}

function getNodeDistance(map, fromId, toId) {
    const visited = new Set();
    let current = [fromId];
    let depth = 0;

    while (depth < 3) {
        if (current.includes(toId)) return depth;
        const next = [];

        for (const id of current) {
            const node = map.find(n => n.id === id);
            if (!node) continue;
            visited.add(id);
            node.connections.forEach(conn => {
                if (!visited.has(conn)) next.push(conn);
            });
        }

        current = next;
        depth++;
    }

    return -1;
}


/**
 * Genera una raid para un jugador
 */
export async function createRaidForPlayer(playerId) {
    let guaranteedWeaponNodesUsed = 0;

    // 1. Generar nodos con loot
    const enrichedNodes = await Promise.all(
        map0.map(async (node) => {
            const { items, guaranteedWeaponGiven } = await generateLoot(
                node.type,
                node.level,
                node.id,
                null, // 🚫 No hay startingNode
                guaranteedWeaponNodesUsed
            );

            if (guaranteedWeaponGiven) guaranteedWeaponNodesUsed++;

            return {
                id: node.id,
                type: node.type,
                connections: node.connections,
                extractionZone: node.extractionZone,
                spawn: node.spawn,
                loot: items,
                noiseLevel: 0,
                status: "hidden",
                level: node.level,
                soldiers: [] // SCAVs y luego jugadores se añaden aquí
            };
        })
    );

    // 2. Inyectar SCAVs (elige los nodos internamente, no depende del jugador)
    await injectScavsInRaid({ nodes: enrichedNodes }, null, 5);

    // 3. Crear raid final con loot + SCAVs
    const raid = await RaidModel.create({
        nodes: enrichedNodes,
        state: "active",
        startTime: new Date()
    });

    console.log("RAID CREADA:", raid._id);

    return { raid };
}

/**
 * Obtiene todos los soldados de una raid
 */
export async function getAllSoldiersFromRaidService(raidId) {
    const raid = await RaidModel.findById(raidId).lean();
    if (!raid) throw new Error("Raid no encontrada");

    const soldiers = [];

    for (const node of raid.nodes) {
        if (!node.soldiers || node.soldiers.length === 0) continue;

        for (const soldier of node.soldiers) {
            soldiers.push({
                nodeId: node.id,
                type: soldier.type,
                isAlive: soldier.isAlive,
                aggression: soldier.aggression,
                alertLevel: soldier.alertLevel,
                weapon: soldier.equippedWeapon,
                inventory: soldier.inventory
            });
        }
    }

    return { raidId, total: soldiers.length, soldiers };
}

