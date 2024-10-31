import getBlockNumber from "./getBlockNumber.js";
import getFromBlock from "./getFromBlock.js";
import processBlockRange from "./processBlockRange.js";
import { subscribeToEvents } from "./websocketClient.js";

async function indexEventsForNetwork(network) {
  console.log(`Starting indexer for ${network}...`);
  while (true) {
    try {
      const latestBlock = await getBlockNumber(network);
      let fromBlock = BigInt(getFromBlock(network));
      console.log(
        `${network} - Backfilling data from block ${fromBlock} to ${latestBlock}`
      );
      await processBlockRange(network, fromBlock, latestBlock);
      console.log(
        `${network} - Backfilling complete. Setting up watcher for new events...`
      );

      const eventName = "RewardsDeposit";
      await subscribeToEvents(network, eventName, async (logs) => {
        try {
          for (const log of logs) {
            console.log(
              `${network} - Processed new event in block ${log.blockNumber}`
            );
          }
        } catch (error) {
          console.error(
            `${network} - Error processing real-time event:`,
            error
          );
        }
      });

      console.log(`${network} - Watcher set up. Listening for new events...`);
      break;
    } catch (error) {
      console.error(`${network} - Error in indexEvents:`, error);
      console.log(`${network} - Retrying in 1 minute...`);
      await new Promise((resolve) => setTimeout(resolve, 60000));
    }
  }
}

export default indexEventsForNetwork;
