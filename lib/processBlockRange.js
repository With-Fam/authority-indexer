import processBlocks from "./processBlocks.js";

const CHUNK_SIZE = 250;
const CONCURRENCY_LIMIT = 5;

async function processBlockRange(network, fromBlock, latestBlock) {
  let currentBlock = fromBlock;
  const promises = [];

  while (currentBlock <= latestBlock) {
    const toBlock =
      currentBlock + BigInt(CHUNK_SIZE) > latestBlock
        ? latestBlock
        : currentBlock + BigInt(CHUNK_SIZE);

    // Start processing the current chunk
    const promise = processBlocks(network, currentBlock, toBlock);
    promises.push(promise);

    currentBlock = toBlock + 1n;

    // If we've reached the concurrency limit, wait for the current batch to finish
    if (promises.length >= CONCURRENCY_LIMIT) {
      await Promise.all(promises);
      promises.length = 0; // Reset the promises array
    }
  }

  // Wait for any remaining promises
  if (promises.length > 0) {
    await Promise.all(promises);
  }
}

export default processBlockRange;
