export const NETWORKS = {
  BASE_MAINNET: "base",
  BASE_TESTNET: "baseSepolia",
};

export const RPC_URLS = {
  base: {
    http: [
      "https://mainnet.base.org",
      "https://base.llamarpc.com",
      "https://base.blockpi.network/v1/rpc/public",
      "https://developer-access-mainnet.base.org",
      "https://base-rpc.publicnode.com",
    ],
    ws: "wss://base-rpc.publicnode.com",
  },
  baseSepolia: {
    http: [
      "https://sepolia.base.org",
      "https://base-sepolia-rpc.publicnode.com",
      "https://base-sepolia.blockpi.network/v1/rpc/public",
    ],
    ws: "wss://base-sepolia-rpc.publicnode.com",
  },
};
