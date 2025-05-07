import ItemModel from "../models/item.js";
import RaidModel from "../models/raid.js";

/**
 * Devuelve una lista de nodos elegibles para SCAVs (no spawn, no extraction)
 */
function getEligibleScavNodes(nodes) {
    return nodes.filter(n => !n.spawn && !n.extractionZone);
}

/**
 * Genera un SCAV con equipamiento según su nivel
 */
/**
 * Genera un SCAV con equipamiento según su nivel
 */
export async function generateScav(level = 1) {
    const aliases = [
        "Cuervo", "Lobo", "Halcón", "Serpiente", "Sombra", "Trueno", "Zorro",
        "Buitre", "Jaguar", "Corzo", "Escorpión", "Águila", "Tejón", "Fénix", "Rata",
        "Murciélago", "Hiena", "Puma", "Pantera", "Mapache", "Cóndor", "Chacal", "Tigre",
        "Gavilán", "Caracal", "Gato", "Oso", "Guepardo", "Lechuza", "Gorrión", "Gallo",
        "Gaviota", "Mono", "Zopilote", "Tarántula", "Iguana", "Anaconda", "Rinoceronte",
        "Búfalo", "Perro", "Ciervo", "Coyote", "Lémur", "Búho", "Gato montés", "Pájaro loco",
        "Tiburón", "Caimán", "Hormiga", "Escarabajo", "Lince", "Cobra", "Dragón",
        "Grillo", "Camaleón", "Tortuga", "Tigre blanco", "Cierva", "Bisonte", "Elefante",
        "Colibrí", "Liebre", "Alce", "Topo", "Nutria", "Pulpo", "Calamar", "Ganso",
        "Pez espada", "Ballena", "Carpintero", "Cisne", "Langosta", "Saltamontes",
        "Camello", "Koala"
    ];

    const alias = aliases[Math.floor(Math.random() * aliases.length)];
    const scav = {
        name: `scav_${alias.toLowerCase()}`,
        type: "scav",
        npc: true,
        noiseLevel: Math.random() * 10,
        aggression: Math.min(Math.random() + level / 10, 1),
        alertLevel: 0,
        equippedWeapon: null,
        inventory: [],
        health: 100,
        stamina: 100,
        hydration: 100,
        energy: 100,
        isAlive: true
    };

    let rarityFilter;
    if (level >= 8) {
        rarityFilter = { $in: ["rare", "epic"] };
    } else if (level >= 4) {
        rarityFilter = { $in: ["common", "rare"] };
    } else {
        rarityFilter = "common";
    }

    const weaponCandidates = await ItemModel.find({
        category: "weapon",
        rarity: rarityFilter
    });

    const lootCandidates = await ItemModel.find({
        rarity: { $in: ["common", "rare"] },
        category: { $ne: "weapon" }
    });

    if (weaponCandidates.length) {
        const weapon = weaponCandidates[Math.floor(Math.random() * weaponCandidates.length)];
        scav.equippedWeapon = weapon._id;
    }

    const lootCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < lootCount; i++) {
        const loot = lootCandidates[Math.floor(Math.random() * lootCandidates.length)];
        scav.inventory.push(loot._id);
    }

    return scav;
}


/**
 * Inserta SCAVs en los nodos de una raid guardada en DB
 */
export async function placeScavsInNodes(raidId, nodeIdsWithLevels = []) {
    const raid = await RaidModel.findById(raidId).lean();
    if (!raid) throw new Error("Raid no encontrada");

    const updatedNodes = raid.nodes.map((node) => {
        const scavConfig = nodeIdsWithLevels.find(cfg => cfg.id === node.id);
        if (!scavConfig) return node;

        node.soldiers = node.soldiers || [];

        return {
            ...node,
            soldiers: [...node.soldiers]
        };
    });

    for (const { id, level } of nodeIdsWithLevels) {
        const scav = await generateScav(level);
        const node = updatedNodes.find(n => n.id === id);
        if (node) node.soldiers.push(scav);
    }

    await RaidModel.findByIdAndUpdate(raidId, { nodes: updatedNodes });
    return nodeIdsWithLevels.length;
}

/**
 * Lógica para inyectar SCAVs al array de nodos en memoria
 */
export async function injectScavsInRaid(raid, _unused = null, count = 5) {
    const eligibleNodes = getEligibleScavNodes(raid.nodes)
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

    for (const node of eligibleNodes) {
        const scav = await generateScav(node.level);
        node.soldiers = node.soldiers || [];
        node.soldiers.push(scav);
    }

    console.log(`SCAVs generados: ${eligibleNodes.length}`);
}
