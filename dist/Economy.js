"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Economy = void 0;
const mongoose_1 = require("mongoose");
const EconomySchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    userId: String,
    guildId: String,
    wallet: Number,
    bank: Number,
});
exports.Economy = (0, mongoose_1.model)("economy", EconomySchema, "economies");
