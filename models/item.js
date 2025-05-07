import { Schema, model } from "mongoose";

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    rarity: {
        type: String,
        enum: ["common", "rare", "epic"],
        default: "common"
    },
    averagePrice: {
        type: Number,
        default: 0
    },
    weight: {
        type: Number,
        default: 1
    },
    usable: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: ["weapon", "ammo", "tool", "medical", "key", "loot", "trash"],
        required: true
    },
    // Solo si category === 'ammo'
    ammoType: {
        type: String,
        enum: ["9mm", "5.56mm", "12ga", "7.62mm"],
        required: function () {
            return this.category === "ammo";
        }
    },
    // Solo si category === 'weapon'
    compatibleAmmoTypes: {
        type: [String],
        enum: ["9mm", "5.56mm", "12ga", "7.62mm"],
        required: function () {
            return this.category === "weapon";
        },
        default: undefined
    },
    spawnChances: {
        forest: {
            type: Number,
            default: 0
        },
        urban: {
            type: Number,
            default: 0
        },
        industrial: {
            type: Number,
            default: 0
        },
        underground: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true,
    versionKey: false
});

const ItemModel = model("item", itemSchema);
export default ItemModel;
