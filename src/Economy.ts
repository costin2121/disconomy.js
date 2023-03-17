import { model, Schema } from "mongoose";

const EconomySchema = new Schema({
  _id: Schema.Types.ObjectId,
  userId: String,
  guildId: String,
  wallet: Number,
  bank: Number,
});

export const Economy = model("economy", EconomySchema, "economies");
