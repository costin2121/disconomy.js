import { Schema } from "mongoose";

export type DisconomyOptions = {
  /**The default amount that is in the wallet when a new profile is created */
  defaultWallet: number;
  /**The default amount that is in the bank when a new profile is created */
  defaultBank: number;
  /**This determines whether you want or don't want info to be logged when an action happens */
  log: boolean;
  /**This determines whether you want or don't want to allow the wallet/bank amounts to be smaller than zero  */
  allowNegativeBalance: boolean;
  /**This determines whether you want or don't want to show warnings */
  showWarnings: boolean;
};
