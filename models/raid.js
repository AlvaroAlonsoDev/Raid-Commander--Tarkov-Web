import { Schema, model } from "mongoose";

const soldierSchema = new Schema({
    name: String,
    type: String,
    npc: Boolean,
    noiseLevel: Number,
    aggression: Number,
    alertLevel: Number,
    equippedWeapon: { type: Schema.Types.ObjectId, ref: "item" },
    inventory: [{ type: Schema.Types.ObjectId, ref: "item" }],
    health: Number,
    stamina: Number,
    hydration: Number,
    energy: Number,
    isAlive: Boolean
}, { _id: false }); // 👈 importante para que no cree un _id por cada soldier

const nodeSchema = new Schema({
    id: String,
    type: String,
    connections: [String],
    extractionZone: Boolean,
    spawn: Boolean,
    loot: [{ type: Schema.Types.ObjectId, ref: "item" }],
    noiseLevel: Number,
    status: String,
    level: Number,
    soldiers: [soldierSchema] // ✅ CORRECTO: array de objetos con schema
}, { _id: false });

const raidSchema = new Schema({
    nodes: [nodeSchema],
    state: {
        type: String,
        enum: ["active", "finished"],
        default: "active"
    },
    startTime: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
    versionKey: false
});

const RaidModel = model("raids", raidSchema);
export default RaidModel;
