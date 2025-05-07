import ItemModel from "../models/item.js";

export const getAllItemsService = async () => {
    const items = await ItemModel.find({});
    return items;
};

export const getLootByIds = async (ids) => {
    return await ItemModel.find({ _id: { $in: ids } });
};

export const createManyItems = async (items) => {
    const created = await ItemModel.insertMany(items, { ordered: false });
    return created;
};
