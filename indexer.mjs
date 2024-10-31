import indexEventsForNetwork from "./lib/indexEventsForNetwork.js";
import { NETWORKS } from "./lib/rpc.js";

async function indexAllNetworks() {
  await Promise.all(Object.values(NETWORKS).map(indexEventsForNetwork));
}

indexAllNetworks().catch(console.error);
