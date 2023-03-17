"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disconomy = void 0;
const mongoose = __importStar(require("mongoose"));
const Economy_1 = require("./Economy");
const chalk_1 = __importDefault(require("chalk"));
const brOpen = chalk_1.default.green("[");
const brClose = chalk_1.default.green("]");
class Disconomy {
    constructor(options) {
        this._defaultWallet = (options === null || options === void 0 ? void 0 : options.defaultWallet) || 100;
        this._defaultBank = (options === null || options === void 0 ? void 0 : options.defaultBank) || 0;
        this._log = (options === null || options === void 0 ? void 0 : options.log) || false;
        this._allowNegativeBalance = (options === null || options === void 0 ? void 0 : options.allowNegativeBalance) || false;
        this._showWarnings = (options === null || options === void 0 ? void 0 : options.showWarnings) || true;
    }
    setURL(url) {
        return __awaiter(this, void 0, void 0, function* () {
            mongoose.set("strictQuery", false);
            let connection = yield mongoose.connect(url);
            if (this._log) {
                connection.connection.once("connection", () => `${brOpen}${chalk_1.default.cyan("Disconomy")}${brClose} Connected to the economy system`);
                connection.connection.once("disconnected", () => console.log(`${brOpen}${chalk_1.default.redBright("Disconomy")}${brClose} Disconnected from the economy system`));
                connection.connection.once("error", (e) => console.log(`${brOpen}${chalk_1.default.red("Disconomy")}${brClose} Couldn't connect to the economy system: ` + e));
            }
        });
    }
    createEconomyProfile(userId, guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            let profile = yield Economy_1.Economy.findOne({ userId: userId, guildId: guildId });
            if (profile)
                throw new Error(`Profile with user id ${userId} and guild id ${guildId} already exists in the database.`);
            profile = yield Economy_1.Economy.create({
                _id: new mongoose.Types.ObjectId(),
                userId: userId,
                guildId: guildId,
                wallet: this._defaultWallet,
                bank: this._defaultBank,
            });
            if (this._log) {
                console.log(`${brOpen}${chalk_1.default.greenBright("Disconomy")}${brClose} Created new profile with: User Id ${chalk_1.default.blueBright(userId)} & Guild Id ${chalk_1.default.blueBright(guildId)}`);
            }
        });
    }
    deleteEconomyProfile(userId, guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            let profile = yield Economy_1.Economy.findOne({ userId: userId, guildId: guildId });
            if (!profile)
                throw new Error(`Profile with user id ${userId} and guild id ${guildId} doesn't exist in the database.`);
            yield Economy_1.Economy.deleteOne({
                userId: userId,
                guildId: guildId,
            });
            if (this._log) {
                console.log(`${brOpen}${chalk_1.default.magenta("Disconomy")}${brClose} Deleted profile with: User Id ${chalk_1.default.blueBright(userId)} & Guild Id ${chalk_1.default.blueBright(guildId)}`);
            }
        });
    }
    getEconomyProfile(userId, guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            let profile = yield Economy_1.Economy.findOne({
                userId: userId,
                guildId: guildId,
            });
            if (profile == null) {
                profile = undefined;
            }
            else {
                // let data: EconomyProfile = {
                //   _id: profile["_id"],
                //   userId: profile["userId"]?.toString(),
                //   guildId: profile["guildId"]?.toString(),
                //   wallet: profile["wallet"],
                //   bank: profile["bank"],
                // };
                return profile;
            }
        });
    }
    /**
     * @param amount The amount you want to change the value of the wallet by, if you want to add to the wallet, set this to a positive number, if you want to remove from the wallet, set this to a negative number.
     */
    changeWalletBy(amount, userId, guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            let profile = yield Economy_1.Economy.findOne({
                userId: userId,
                guildId: guildId,
            });
            let oldWallet = profile["wallet"];
            if (profile == null)
                throw new Error(`Profile with user id ${chalk_1.default.blueBright(userId)} and guild id ${chalk_1.default.blueBright(guildId)} doesn't exist in the database.`);
            profile["wallet"] += amount;
            if (!this._allowNegativeBalance && profile["wallet"] < 0) {
                if (this._showWarnings) {
                    console.log(`${brOpen}${chalk_1.default.yellow("WARNING")}${brClose} Wallet amount automatically set to ${chalk_1.default.yellowBright("0")} due to it being less than ${chalk_1.default.yellowBright("0")}, which is not allowed by the ${chalk_1.default.blueBright("Allow Negative Balance")} option. To disable warnings set the ${chalk_1.default.blueBright("Show Warnings")} parameter to false`);
                }
                profile["wallet"] = 0;
            }
            yield profile.save();
            if (this._log) {
                console.log(`${brOpen}${chalk_1.default.cyan("Disconomy")}${brClose} Wallet of profile with: User Id ${chalk_1.default.blueBright(userId)} & Guild Id ${chalk_1.default.blueBright(guildId)}  changed by ${chalk_1.default.yellowBright(amount)}. Old value: ${chalk_1.default.yellowBright(oldWallet)}, New Value: ${chalk_1.default.yellowBright(profile["wallet"])}`);
            }
        });
    }
    setWalletTo(amount, userId, guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            let profile = yield Economy_1.Economy.findOne({
                userId: userId,
                guildId: guildId,
            });
            let oldWallet = profile["wallet"];
            if (profile == null)
                throw new Error(`Profile with user id ${chalk_1.default.blueBright(userId)} and guild id ${chalk_1.default.blueBright(guildId)} doesn't exist in the database.`);
            profile["wallet"] = amount;
            if (!this._allowNegativeBalance && profile["wallet"] < 0) {
                if (this._showWarnings) {
                    console.log(`${brOpen}${chalk_1.default.yellow("WARNING")}${brClose} Wallet amount automatically set to ${chalk_1.default.yellowBright("0")} due to it being less than ${chalk_1.default.yellowBright("0")}, which is not allowed by the ${chalk_1.default.blueBright("Allow Negative Balance")} option. To disable warnings set the ${chalk_1.default.blueBright("Show Warnings")} parameter to false`);
                }
                profile["wallet"] = 0;
            }
            yield profile.save();
            if (this._log) {
                console.log(`${brOpen}${chalk_1.default.cyan("Disconomy")}${brClose} Wallet of profile with: User Id ${chalk_1.default.blueBright(userId)} & Guild Id ${chalk_1.default.blueBright(guildId)} was set to ${chalk_1.default.yellowBright(amount)}. Old value: ${chalk_1.default.yellowBright(oldWallet)}, New Value: ${chalk_1.default.yellowBright(profile["wallet"])}`);
            }
        });
    }
}
exports.Disconomy = Disconomy;
