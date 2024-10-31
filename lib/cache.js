// lib/cache.js
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 });

export function getCached(key) {
  return cache.get(key);
}

export function setCached(key, value) {
  cache.set(key, value);
}
