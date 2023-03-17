import * as mongoose from "mongoose";
import { Economy } from "./Economy";
import { EconomyProfile } from "./types/EconomyProfile";
import { DisconomyOptions } from "./types/DisconomyOptions";
import colors from "chalk";

const brOpen = colors.green("[");
const brClose = colors.green("]");

export class Disconomy {
  private _defaultWallet: number;
  private _defaultBank: number;
  private _log: boolean;
  private _allowNegativeBalance: boolean;
  private _showWarnings: boolean;

  constructor(options?: DisconomyOptions) {
    this._defaultWallet = options?.defaultWallet || 100;
    this._defaultBank = options?.defaultBank || 0;
    this._log = options?.log || false;
    this._allowNegativeBalance = options?.allowNegativeBalance || false;
    this._showWarnings = options?.showWarnings || true;
  }

  async setURL(url: string): Promise<void> {
    mongoose.set("strictQuery", false);
    let connection = await mongoose.connect(url);
    if (this._log) {
      connection.connection.once(
        "connection",
        () =>
          `${brOpen}${colors.cyan(
            "Disconomy"
          )}${brClose} Connected to the economy system`
      );
      connection.connection.once("disconnected", () =>
        console.log(
          `${brOpen}${colors.redBright(
            "Disconomy"
          )}${brClose} Disconnected from the economy system`
        )
      );
      connection.connection.once("error", (e) =>
        console.log(
          `${brOpen}${colors.red(
            "Disconomy"
          )}${brClose} Couldn't connect to the economy system: ` + e
        )
      );
    }
  }

  async createEconomyProfile(userId: string, guildId: string): Promise<void> {
    let profile = await Economy.findOne({ userId: userId, guildId: guildId });

    if (profile)
      throw new Error(
        `Profile with user id ${userId} and guild id ${guildId} already exists in the database.`
      );

    profile = await Economy.create({
      _id: new mongoose.Types.ObjectId(),
      userId: userId,
      guildId: guildId,
      wallet: this._defaultWallet,
      bank: this._defaultBank,
    });

    if (this._log) {
      console.log(
        `${brOpen}${colors.greenBright(
          "Disconomy"
        )}${brClose} Created new profile with: User Id ${colors.blueBright(
          userId
        )} & Guild Id ${colors.blueBright(guildId)}`
      );
    }
  }

  async deleteEconomyProfile(userId: string, guildId: string): Promise<void> {
    let profile = await Economy.findOne({ userId: userId, guildId: guildId });

    if (!profile)
      throw new Error(
        `Profile with user id ${userId} and guild id ${guildId} doesn't exist in the database.`
      );

    await Economy.deleteOne({
      userId: userId,
      guildId: guildId,
    });

    if (this._log) {
      console.log(
        `${brOpen}${colors.magenta(
          "Disconomy"
        )}${brClose} Deleted profile with: User Id ${colors.blueBright(
          userId
        )} & Guild Id ${colors.blueBright(guildId)}`
      );
    }
  }

  async getEconomyProfile(userId: string, guildId: string) {
    let profile: any = await Economy.findOne({
      userId: userId,
      guildId: guildId,
    });

    if (profile == null) {
      profile = undefined;
    } else {
      // let data: EconomyProfile = {
      //   _id: profile["_id"],
      //   userId: profile["userId"]?.toString(),
      //   guildId: profile["guildId"]?.toString(),
      //   wallet: profile["wallet"],
      //   bank: profile["bank"],
      // };
      return profile;
    }
  }

  /**
   * @param amount The amount you want to change the value of the wallet by, if you want to add to the wallet, set this to a positive number, if you want to remove from the wallet, set this to a negative number.
   */
  async changeWalletBy(
    amount: number,
    userId: string,
    guildId: string
  ): Promise<void> {
    let profile: any = await Economy.findOne({
      userId: userId,
      guildId: guildId,
    });
    let oldWallet = profile["wallet"];

    if (profile == null)
      throw new Error(
        `Profile with user id ${colors.blueBright(
          userId
        )} and guild id ${colors.blueBright(
          guildId
        )} doesn't exist in the database.`
      );

    profile["wallet"] += amount;

    if (!this._allowNegativeBalance && profile["wallet"] < 0) {
      if (this._showWarnings) {
        console.log(
          `${brOpen}${colors.yellow(
            "WARNING"
          )}${brClose} Wallet amount automatically set to ${colors.yellowBright(
            "0"
          )} due to it being less than ${colors.yellowBright(
            "0"
          )}, which is not allowed by the ${colors.blueBright(
            "Allow Negative Balance"
          )} option. To disable warnings set the ${colors.blueBright(
            "Show Warnings"
          )} parameter to false`
        );
      }
      profile["wallet"] = 0;
    }

    await profile.save();

    if (this._log) {
      console.log(
        `${brOpen}${colors.cyan(
          "Disconomy"
        )}${brClose} Wallet of profile with: User Id ${colors.blueBright(
          userId
        )} & Guild Id ${colors.blueBright(
          guildId
        )}  changed by ${colors.yellowBright(
          amount
        )}. Old value: ${colors.yellowBright(
          oldWallet
        )}, New Value: ${colors.yellowBright(profile["wallet"])}`
      );
    }
  }

  async setWalletTo(
    amount: number,
    userId: string,
    guildId: string
  ): Promise<void> {
    let profile: any = await Economy.findOne({
      userId: userId,
      guildId: guildId,
    });
    let oldWallet = profile["wallet"];

    if (profile == null)
      throw new Error(
        `Profile with user id ${colors.blueBright(
          userId
        )} and guild id ${colors.blueBright(
          guildId
        )} doesn't exist in the database.`
      );

    profile["wallet"] = amount;

    if (!this._allowNegativeBalance && profile["wallet"] < 0) {
      if (this._showWarnings) {
        console.log(
          `${brOpen}${colors.yellow(
            "WARNING"
          )}${brClose} Wallet amount automatically set to ${colors.yellowBright(
            "0"
          )} due to it being less than ${colors.yellowBright(
            "0"
          )}, which is not allowed by the ${colors.blueBright(
            "Allow Negative Balance"
          )} option. To disable warnings set the ${colors.blueBright(
            "Show Warnings"
          )} parameter to false`
        );
      }
      profile["wallet"] = 0;
    }

    await profile.save();

    if (this._log) {
      console.log(
        `${brOpen}${colors.cyan(
          "Disconomy"
        )}${brClose} Wallet of profile with: User Id ${colors.blueBright(
          userId
        )} & Guild Id ${colors.blueBright(
          guildId
        )} was set to ${colors.yellowBright(
          amount
        )}. Old value: ${colors.yellowBright(
          oldWallet
        )}, New Value: ${colors.yellowBright(profile["wallet"])}`
      );
    }
  }
}
