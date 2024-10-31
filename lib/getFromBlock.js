import {
  BASE_SEPOLIA_FIRST_BLOCK,
  BASE_FIRST_BLOCK,
  ZORA_FIRST_BLOCK,
  ZORA_SEPOLIA_FIRST_BLOCK,
} from "./const.js";
import { NETWORKS } from "./rpc.js";

function getFromBlock(network) {
  switch (network) {
    case NETWORKS.BASE_TESTNET:
      return BASE_SEPOLIA_FIRST_BLOCK;
    case NETWORKS.BASE_MAINNET:
      return BASE_FIRST_BLOCK;
    case NETWORKS.ZORA_TESTNET:
      return ZORA_SEPOLIA_FIRST_BLOCK;
    case NETWORKS.ZORA_MAINNET:
      return ZORA_FIRST_BLOCK;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

export default getFromBlock;
