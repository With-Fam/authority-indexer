import dotenv from "dotenv";

dotenv.config();

export const BASE_SEPOLIA_FIRST_BLOCK = BigInt(
  process.env.BASE_SEPOLIA_FIRST_BLOCK || "0"
);
export const BASE_FIRST_BLOCK = BigInt(process.env.BASE_FIRST_BLOCK || "0");
export const ZORA_SEPOLIA_FIRST_BLOCK = BigInt(process.env.ZORA_SEPOLIA_FIRST_BLOCK || "0");
export const ZORA_FIRST_BLOCK = BigInt(process.env.ZORA_FIRST_BLOCK || "0");
