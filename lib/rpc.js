export const NETWORKS = {
  BASE_MAINNET: "base",
  BASE_TESTNET: "baseSepolia",
  ZORA_MAINNET: "zora",
  ZORA_TESTNET: "zoraSepolia",
};

export const RPC_URLS = {
  [NETWORKS.BASE_MAINNET]: {
    http: [
      "https://mainnet.base.org",
      "https://base.llamarpc.com",
      "https://base.blockpi.network/v1/rpc/public",
      "https://developer-access-mainnet.base.org",
      "https://base-rpc.publicnode.com",
    ],
    ws: "wss://base-rpc.publicnode.com",
  },
  [NETWORKS.BASE_TESTNET]: {
    http: [
      "https://sepolia.base.org",
      "https://base-sepolia-rpc.publicnode.com",
      "https://base-sepolia.blockpi.network/v1/rpc/public",
    ],
    ws: "wss://base-sepolia-rpc.publicnode.com",
  },
  [NETWORKS.ZORA_MAINNET]: {
    http: ["https://zora.drpc.org", "https://rpc.zora.energy"],
    ws: "wss://zora.drpc.org",
  },
  [NETWORKS.ZORA_TESTNET]: {
    http: ["https://sepolia.rpc.zora.energy"],
    ws: "wss://sepolia.rpc.zora.energy",
  },
};
