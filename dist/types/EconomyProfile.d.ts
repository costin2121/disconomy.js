import { Schema } from "mongoose";
export type EconomyProfile = {
    _id: Schema.Types.ObjectId;
    userId: string;
    guildId: string;
    wallet: number;
    bank: number;
};
