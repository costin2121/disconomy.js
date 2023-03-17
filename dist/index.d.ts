import { DisconomyOptions } from "./types/DisconomyOptions";
export declare class Disconomy {
    private _defaultWallet;
    private _defaultBank;
    private _log;
    private _allowNegativeBalance;
    private _showWarnings;
    constructor(options?: DisconomyOptions);
    setURL(url: string): Promise<void>;
    createEconomyProfile(userId: string, guildId: string): Promise<void>;
    deleteEconomyProfile(userId: string, guildId: string): Promise<void>;
    getEconomyProfile(userId: string, guildId: string): Promise<any>;
    /**
     * @param amount The amount you want to change the value of the wallet by, if you want to add to the wallet, set this to a positive number, if you want to remove from the wallet, set this to a negative number.
     */
    changeWalletBy(amount: number, userId: string, guildId: string): Promise<void>;
    setWalletTo(amount: number, userId: string, guildId: string): Promise<void>;
}
